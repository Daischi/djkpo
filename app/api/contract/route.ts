import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// Aumentar timeout para 60s no Vercel
export const maxDuration = 60;

interface ContractData {
  nomeCompleto: string;
  cpf: string;
  email: string;
  nomeEvento: string;
  tipoEvento: string;
  localEvento: string;
  dataEvento: string;
  horarioInicio: string;
  horarioTermino: string;
  signature: string;
}

const DATA_FILE = path.join(process.cwd(), "public", "occupied-dates.json");

// ─── Helpers de data ─────────────────────────────────────────────────────────

function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

function formatDateExtended(date: Date): string {
  const months = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
  ];
  return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
}

// ─── Geração do PDF com pdf-lib (funciona 100% em serverless) ────────────────

async function generateContractPDF(data: ContractData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 42;
  const contentWidth = pageWidth - margin * 2;
  const lineHeight = 14;
  const black = rgb(0, 0, 0);
  const gray = rgb(0.4, 0.4, 0.4);

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  function checkPage(needed = 60) {
    if (y < margin + needed) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
  }

  function wrapText(
    text: string,
    font: typeof timesRoman,
    fontSize: number,
    maxW: number,
  ): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(test, fontSize) > maxW) {
        if (current) lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  function drawText(
    text: string,
    font: typeof timesRoman,
    fontSize: number,
    indent = 0,
    extraSpacing = 0,
  ) {
    const lines = wrapText(text, font, fontSize, contentWidth - indent);
    for (const line of lines) {
      checkPage(lineHeight + 4);
      page.drawText(line, { x: margin + indent, y, size: fontSize, font, color: black });
      y -= lineHeight;
    }
    y -= extraSpacing;
  }

  function drawTitle(text: string) {
    checkPage(30);
    y -= 4;
    page.drawText(text, { x: margin, y, size: 10, font: timesBold, color: black });
    y -= lineHeight + 2;
  }

  function drawLine() {
    page.drawLine({
      start: { x: margin, y },
      end: { x: pageWidth - margin, y },
      thickness: 0.5,
      color: gray,
    });
    y -= 8;
  }

  // ── Cabeçalho ──
  const title = "CONTRATO DE PRESTAÇÃO DE SERVIÇOS";
  const titleW = timesBold.widthOfTextAtSize(title, 16);
  page.drawText(title, { x: (pageWidth - titleW) / 2, y, size: 16, font: timesBold, color: black });
  y -= 20;

  const sub = "DISCOTECAGEM E ILUMINAÇÃO";
  const subW = timesRoman.widthOfTextAtSize(sub, 12);
  page.drawText(sub, { x: (pageWidth - subW) / 2, y, size: 12, font: timesRoman, color: black });
  y -= 10;
  drawLine();

  // ── Introdução ──
  drawText("Pelo presente instrumento particular, as partes abaixo identificadas:", timesRoman, 10, 0, 4);

  // ── CONTRATANTE ──
  drawText("CONTRATANTE:", timesBold, 10, 0, 2);
  drawText(`Nome: ${data.nomeCompleto}`, timesRoman, 10, 8, 0);
  drawText(`CPF: ${data.cpf}`, timesRoman, 10, 8, 0);
  drawText(`Email: ${data.email}`, timesRoman, 10, 8, 6);

  // ── CONTRATADO ──
  drawText("CONTRATADO (DEEJAY):", timesBold, 10, 0, 2);
  drawText("Nome: Leonardo Capovilla", timesRoman, 10, 8, 0);
  drawText("Nome artístico: DJ-Kp0", timesRoman, 10, 8, 0);
  drawText("CPF: 215.714.098-07", timesRoman, 10, 8, 0);
  drawText("Endereço: Rua Juaguaré, 216", timesRoman, 10, 8, 0);
  drawText("Chave PIX: lojaaloehas@gmail.com", timesRoman, 10, 8, 8);

  drawText("Têm entre si justo e contratado o que segue:", timesRoman, 10, 0, 8);

  // ── Cláusula 1 ──
  drawTitle("CLÁUSULA 1 – DO OBJETO");
  drawText("1.1. O presente contrato tem como objeto a prestação de serviços de discotecagem (Deejay) pelo CONTRATADO no evento descrito a seguir:", timesRoman, 9, 0, 3);
  const details = [
    `Nome do evento: ${data.nomeEvento}`,
    `Tipo do evento: ${data.tipoEvento}`,
    `Local: ${data.localEvento}`,
    `Data: ${formatDateShort(data.dataEvento)}`,
    `Horário de início: ${data.horarioInicio} | Horário de término: ${data.horarioTermino}`,
  ];
  for (const d of details) drawText(`• ${d}`, timesRoman, 9, 12, 0);
  y -= 4;

  // ── Cláusula 2 ──
  drawTitle("CLÁUSULA 2 – DAS OBRIGAÇÕES DO CONTRATADO");
  drawText("2.1. O CONTRATADO compromete-se a:", timesRoman, 9, 0, 2);
  const c2 = [
    "Comparecer ao local do evento na data acordada com antecedência mínima de 40 minutos;",
    "Executar seleção musical adequada ao tipo do evento, podendo incluir pedidos do CONTRATANTE;",
    "Levar seus equipamentos quando solicitado, ou utilizar estrutura fornecida pelo CONTRATANTE conforme prévio e expresso acordo;",
    "Manter postura profissional durante toda a execução do serviço.",
  ];
  c2.forEach((item, i) => drawText(`${String.fromCharCode(97 + i)}) ${item}`, timesRoman, 9, 10, 0));
  y -= 4;

  // ── Cláusula 3 ──
  drawTitle("CLÁUSULA 3 – DAS OBRIGAÇÕES DO CONTRATANTE");
  drawText("3.1. O CONTRATANTE deverá:", timesRoman, 9, 0, 2);
  const c3 = [
    "Garantir acesso ao local para montagem e desmontagem do equipamento;",
    "Disponibilizar ponto de energia adequado e seguro;",
    "Garantir condições de segurança física ao CONTRATADO e seus equipamentos;",
    "Efetuar o pagamento nas condições e prazos acordados;",
    "Se responsabilizar por qualquer dano causado por terceiros aos equipamentos do CONTRATADO.",
  ];
  c3.forEach((item, i) => drawText(`${String.fromCharCode(97 + i)}) ${item}`, timesRoman, 9, 10, 0));
  y -= 4;

  // ── Cláusula 4 ──
  drawTitle("CLÁUSULA 4 – DO VALOR E FORMA DE PAGAMENTO");
  drawText("4.1. Pelo serviço prestado, o CONTRATANTE pagará ao CONTRATADO o valor total de R$ 4.000,00 (Quatro mil reais) de maneira antecipada e integralmente até a véspera do evento, via PIX na chave: lojaaloehas@gmail.com.", timesRoman, 9, 0, 4);

  // ── Cláusula 5 ──
  drawTitle("CLÁUSULA 5 – DO CANCELAMENTO");
  drawText("5.1. Em caso de cancelamento por parte do CONTRATANTE:", timesRoman, 9, 0, 2);
  drawText("• Menos de 7 dias do evento: não há devolução do valor pago;", timesRoman, 9, 10, 0);
  drawText("• Em caso de força maior comprovada, as partes poderão remarcar a data sem multa.", timesRoman, 9, 10, 2);
  drawText("5.2. Em caso de cancelamento pelo CONTRATADO, todos os valores pagos deverão ser devolvidos integralmente, além do compromisso de indicar substituto de mesmo nível profissional.", timesRoman, 9, 0, 4);

  // ── Cláusula 6 ──
  drawTitle("CLÁUSULA 6 – DAS CONDIÇÕES OPERACIONAIS");
  drawText("6.1. Caso o evento ultrapasse o horário contratado, não será cobrada hora adicional no valor.", timesRoman, 9, 0, 2);
  drawText("6.2. O CONTRATANTE se responsabilizará por qualquer dano causado por terceiros aos equipamentos do CONTRATADO.", timesRoman, 9, 0, 4);

  // ── Cláusula 7 ──
  drawTitle("CLÁUSULA 7 – DO USO DE IMAGEM");
  drawText("7.1. O CONTRATADO está autorizado a registrar fotos e vídeos de sua apresentação para uso profissional e divulgação, salvo se o CONTRATANTE manifestar proibição por escrito.", timesRoman, 9, 0, 4);

  // ── Cláusula 8 ──
  drawTitle("CLÁUSULA 8 – DA CONFIDENCIALIDADE");
  drawText("8.1. Informações sensíveis do evento ou do CONTRATANTE não poderão ser divulgadas pelo CONTRATADO sem autorização prévia.", timesRoman, 9, 0, 4);

  // ── Cláusula 9 ──
  drawTitle("CLÁUSULA 9 – DA RESCISÃO");
  drawText("9.1. O presente contrato poderá ser rescindido por qualquer das partes mediante acordo mútuo, observando as regras de cancelamento deste documento.", timesRoman, 9, 0, 4);

  // ── Cláusula 10 ──
  drawTitle("CLÁUSULA 10 – CONDIÇÕES GERAIS");
  const c10 = [
    "10.1. A eventual aceitação ou tolerância, por qualquer das partes, de inexecução de quaisquer cláusulas do presente, a qualquer tempo, deverá ser interpretada como mera liberalidade, não implicando novação, perdão, renúncia ou liberação da obrigação assumida.",
    "10.2. O presente contrato e quaisquer direitos e obrigações dele decorrentes não poderão ser cedidos ou transferidos, no todo ou em parte, por qualquer Parte sem a prévia e expressa anuência, por escrito, da outra Parte.",
    "10.3. O presente Contrato representa um acordo integral entre as Partes e substitui e revoga expressamente quaisquer acordos anteriores entre as Partes.",
    "10.4. Este Contrato obriga as Partes e seus respectivos sucessores e cessionários a partir da data de sua assinatura.",
    "10.5. As partes não serão responsáveis pelo descumprimento de suas obrigações em caso de força maior ou caso fortuito, nos termos do artigo 393 do Código Civil brasileiro.",
    "10.6. As Partes declaram que são independentes e autônomas, não criando este Contrato qualquer vínculo de mandato, sociedade, parceria ou representação comercial.",
  ];
  for (const item of c10) drawText(item, timesRoman, 9, 0, 2);
  y -= 2;

  // ── Cláusula 11 ──
  drawTitle("CLÁUSULA 11 – DO FORO");
  drawText("11.1. Para dirimir quaisquer dúvidas oriundas deste contrato, as partes elegem o foro da comarca da capital do estado de São Paulo.", timesRoman, 9, 0, 8);

  // ── Fechamento ──
  checkPage(80);
  drawText("E, por estarem de pleno acordo, as partes assinam o presente contrato em duas vias de igual teor.", timesBold, 10, 0, 6);
  drawText(`São Paulo, ${formatDateExtended(new Date())}`, timesBold, 10, 0, 24);

  // ── Assinaturas ──
  checkPage(70);
  const halfW = (contentWidth - 20) / 2;

  // Assinatura do contratante (imagem base64)
  if (data.signature) {
    try {
      const base64Data = data.signature.replace(/^data:image\/png;base64,/, "");
      const sigBytes = Buffer.from(base64Data, "base64");
      const sigImage = await pdfDoc.embedPng(sigBytes);
      const sigDims = sigImage.scaleToFit(100, 35);
      page.drawImage(sigImage, {
        x: margin + (halfW - sigDims.width) / 2,
        y: y - sigDims.height,
        width: sigDims.width,
        height: sigDims.height,
      });
    } catch {
      // silencia erro de imagem da assinatura
    }
  }

  // Linha e label do contratante
  page.drawLine({
    start: { x: margin, y: y - 40 },
    end: { x: margin + halfW, y: y - 40 },
    thickness: 0.8,
    color: black,
  });
  page.drawText("CONTRATANTE", {
    x: margin + halfW / 2 - timesBold.widthOfTextAtSize("CONTRATANTE", 9) / 2,
    y: y - 52,
    size: 9,
    font: timesBold,
    color: black,
  });
  page.drawText(data.nomeCompleto, {
    x: margin + halfW / 2 - timesRoman.widthOfTextAtSize(data.nomeCompleto, 8) / 2,
    y: y - 62,
    size: 8,
    font: timesRoman,
    color: black,
  });

  // DJ KPO lado direito
  const djLabel = "DJ KPO";
  page.drawText(djLabel, {
    x: margin + halfW + 20 + (halfW - timesItalic.widthOfTextAtSize(djLabel, 18)) / 2,
    y: y - 20,
    size: 18,
    font: timesItalic,
    color: rgb(0.6, 0.6, 0.6),
  });

  // Linha e label do contratado
  page.drawLine({
    start: { x: margin + halfW + 20, y: y - 40 },
    end: { x: pageWidth - margin, y: y - 40 },
    thickness: 0.8,
    color: black,
  });
  page.drawText("CONTRATADO", {
    x: margin + halfW + 20 + halfW / 2 - timesBold.widthOfTextAtSize("CONTRATADO", 9) / 2,
    y: y - 52,
    size: 9,
    font: timesBold,
    color: black,
  });
  page.drawText("Leonardo Capovilla - DJ-Kp0", {
    x: margin + halfW + 20 + halfW / 2 - timesRoman.widthOfTextAtSize("Leonardo Capovilla - DJ-Kp0", 8) / 2,
    y: y - 62,
    size: 8,
    font: timesRoman,
    color: black,
  });

  return pdfDoc.save();
}

// ─── Marcar data como ocupada (Redis ou arquivo local) ───────────────────────

async function addOccupiedDate(date: string) {
  const hasRedis =
    !!process.env.UPSTASH_REDIS_REST_URL &&
    !!process.env.UPSTASH_REDIS_REST_TOKEN;

  if (hasRedis) {
    try {
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      });
      const REDIS_KEY = "occupied-dates";
      const raw = await redis.get(REDIS_KEY);
      let dates: string[] = [];
      if (Array.isArray(raw)) {
        dates = raw as string[];
      } else if (typeof raw === "string") {
        try { dates = JSON.parse(raw); } catch { dates = []; }
      }
      if (!dates.includes(date)) dates.push(date);
      await redis.set(REDIS_KEY, JSON.stringify(dates));
    } catch (err) {
      console.error("Erro ao salvar data no Redis:", err);
    }
    return;
  }

  // Fallback local (desenvolvimento)
  try {
    let stored: { dates: string[] } = { dates: [] };
    if (fs.existsSync(DATA_FILE)) {
      stored = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }
    if (!stored.dates.includes(date)) stored.dates.push(date);
    fs.writeFileSync(DATA_FILE, JSON.stringify(stored, null, 2));
  } catch (err) {
    console.error("Erro ao salvar data local:", err);
  }
}

// ─── Envio de email via Resend (sem bloqueio SMTP no Vercel) ─────────────────

async function sendContractEmails(data: ContractData, pdfBytes: Uint8Array) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY não configurada. Pulando envio de email.");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const formattedDate = formatDateShort(data.dataEvento);
  const pdfBuffer = Buffer.from(pdfBytes);
  const filename = `Contrato_${data.nomeEvento.replace(/\s+/g, "_")}.pdf`;

  // Email para o cliente
  await resend.emails.send({
    from: "DJ KPO <no-reply@djkpo.com>",
    to: data.email,
    subject: `Contrato Recebido – ${data.nomeEvento}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#0064c8">Seu Contrato foi Recebido!</h2>
        <p>Olá <strong>${data.nomeCompleto}</strong>,</p>
        <p>Recebemos com sucesso o contrato para o evento:</p>
        <div style="background:#f5f5f5;padding:15px;border-radius:5px;margin:15px 0">
          <p><strong>Evento:</strong> ${data.nomeEvento}</p>
          <p><strong>Data:</strong> ${formattedDate}</p>
          <p><strong>Horário:</strong> ${data.horarioInicio} – ${data.horarioTermino}</p>
          <p><strong>Local:</strong> ${data.localEvento}</p>
        </div>
        <p>Em anexo você encontra uma cópia do contrato assinado.</p>
        <p>Em breve você receberá confirmação final da contratação.</p>
        <hr style="margin:20px 0">
        <p style="color:#666;font-size:12px">Mensagem automática. Não responda este email.</p>
      </div>
    `,
    attachments: [{ filename, content: pdfBuffer }],
  });

  // Email para o DJ
  await resend.emails.send({
    from: "DJ KPO Site <no-reply@djkpo.com>",
    to: "guilhermepoppilm@gmail.com",
    subject: `[NOVO CONTRATO] ${data.nomeEvento} – ${data.nomeCompleto}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#0064c8">Novo Contrato Recebido!</h2>
        <div style="background:#e8f4f8;padding:15px;border-radius:5px;border-left:4px solid #0064c8;margin:15px 0">
          <p><strong>Cliente:</strong> ${data.nomeCompleto}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>CPF:</strong> ${data.cpf}</p>
          <hr style="margin:15px 0;border:none;border-top:1px solid #ccc">
          <p><strong>Evento:</strong> ${data.nomeEvento}</p>
          <p><strong>Tipo:</strong> ${data.tipoEvento}</p>
          <p><strong>Local:</strong> ${data.localEvento}</p>
          <p><strong>Data:</strong> ${formattedDate}</p>
          <p><strong>Horário:</strong> ${data.horarioInicio} – ${data.horarioTermino}</p>
        </div>
        <p style="background:#fff3cd;padding:10px;border-radius:5px;border-left:4px solid #ffc107">
          <strong>O contrato assinado está em anexo!</strong>
        </p>
      </div>
    `,
    attachments: [{ filename, content: pdfBuffer }],
  });
}

// ─── Handler principal ────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const data: ContractData = await request.json();

    // Validação
    const required = [
      "nomeCompleto", "cpf", "email", "nomeEvento", "tipoEvento",
      "localEvento", "dataEvento", "horarioInicio", "horarioTermino", "signature",
    ] as const;
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json({ message: `Campo obrigatório ausente: ${field}` }, { status: 400 });
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return NextResponse.json({ message: "Email inválido" }, { status: 400 });
    }
    if (data.cpf.replace(/\D/g, "").length !== 11) {
      return NextResponse.json({ message: "CPF inválido" }, { status: 400 });
    }

    const dateString = data.dataEvento.split("T")[0];
    const formattedDate = formatDateShort(data.dataEvento);

    console.log(`=== NOVO CONTRATO | ${data.nomeCompleto} | ${data.nomeEvento} | ${formattedDate} ===`);

    // 1. Gerar PDF
    const pdfBytes = await generateContractPDF(data);
    console.log(`PDF gerado: ${pdfBytes.length} bytes`);

    // 2. Marcar data como ocupada (antes do email — mais crítico)
    await addOccupiedDate(dateString);
    console.log("Data marcada:", dateString);

    // 3. Enviar emails (falha não cancela o registro)
    let emailError: string | null = null;
    try {
      await sendContractEmails(data, pdfBytes);
      console.log("Emails enviados com sucesso");
    } catch (err) {
      emailError = err instanceof Error ? err.message : String(err);
      console.error("Erro ao enviar emails:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Contrato registrado com sucesso",
      emailError,
      data: { cliente: data.nomeCompleto, evento: data.nomeEvento, data: formattedDate },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Erro ao processar contrato:", message);
    return NextResponse.json({ message: `Erro interno: ${message}` }, { status: 500 });
  }
}
