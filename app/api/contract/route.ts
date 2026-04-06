import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { jsPDF } from "jspdf";
import { Redis } from "@upstash/redis";

// Aumentar timeout para 60s no Vercel (necessário para gerar PDF + enviar emails)
export const maxDuration = 60;

// Contract data interface
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

// Configuração do transporte de email
const setupEmailTransport = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Gerar PDF do contrato (idêntico ao contract-preview.tsx)
function generateContractPDF(contractData: ContractData): Buffer {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  const bottomMargin = 30; // Espaço reservado no final da página
  let yPos = margin;

  // Font configuration
  doc.setFont("Times", "normal");

  // Helper function for text wrapping
  const addWrappedText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    fontSize: number = 11,
  ) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string, index: number) => {
      doc.text(line, x, y + index * 5);
    });
    return y + lines.length * 5;
  };

  // Helper to check if needs new page
  const checkNewPage = (spaceNeeded: number = 20) => {
    if (yPos + spaceNeeded > pageHeight - bottomMargin) {
      doc.addPage();
      yPos = margin;
    }
  };

  // HEADER
  yPos += 5;
  doc.setFontSize(18);
  doc.setFont("Times", "bold");
  doc.text("CONTRATO DE PRESTAÇÃO DE SERVIÇOS", pageWidth / 2, yPos, {
    align: "center",
  });
  yPos += 8;

  doc.setFontSize(12);
  doc.setFont("Times", "normal");
  doc.text("DISCOTECAGEM E ILUMINAÇÃO", pageWidth / 2, yPos, {
    align: "center",
  });
  yPos += 8;

  // Border line
  doc.setDrawColor(100, 100, 100);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 6;

  // Introduction
  doc.setFontSize(10);
  doc.setFont("Times", "normal");
  yPos = addWrappedText(
    "Pelo presente instrumento particular, as partes abaixo identificadas:",
    margin,
    yPos,
    contentWidth,
    10,
  );
  yPos += 5;

  // CONTRATANTE
  doc.setFont("Times", "bold");
  doc.setFontSize(10);
  doc.text("CONTRATANTE:", margin, yPos);
  yPos += 5;

  doc.setFont("Times", "normal");
  doc.text(`Nome: ${contractData.nomeCompleto}`, margin + 3, yPos);
  yPos += 5;
  doc.text(`CPF: ${contractData.cpf}`, margin + 3, yPos);
  yPos += 5;
  doc.text(`Email: ${contractData.email}`, margin + 3, yPos);
  yPos += 8;

  // CONTRATADO
  doc.setFont("Times", "bold");
  doc.text("CONTRATADO (DEEJAY):", margin, yPos);
  yPos += 5;

  doc.setFont("Times", "normal");
  doc.text("Nome: Leonardo Capovilla", margin + 3, yPos);
  yPos += 5;
  doc.text("Nome artístico: DJ-Kp0", margin + 3, yPos);
  yPos += 5;
  doc.text("CPF: 215.714.098-07", margin + 3, yPos);
  yPos += 5;
  doc.text("Endereço: Rua Juaguaré, 216", margin + 3, yPos);
  yPos += 5;
  doc.text("Chave PIX: lojaaloehas@gmail.com", margin + 3, yPos);
  yPos += 8;

  // Transition
  doc.setFont("Times", "normal");
  doc.setFontSize(10);
  doc.text("Têm entre si justo e contratado o que segue:", margin, yPos);
  yPos += 7;

  // CLAUSE 1
  checkNewPage(15);
  doc.setFont("Times", "bold");
  doc.text("CLÁUSULA 1 - DO OBJETO", margin, yPos);
  yPos += 5;

  doc.setFont("Times", "normal");
  yPos = addWrappedText(
    "1.1. O presente contrato tem como objeto a prestação de serviços de discotecagem (Deejay) pelo CONTRATADO no evento descrito a seguir:",
    margin,
    yPos,
    contentWidth,
    9,
  );
  yPos += 3;

  const eventDetails = [
    `Nome do evento: ${contractData.nomeEvento}`,
    `Tipo do evento: ${contractData.tipoEvento}`,
    `Local: ${contractData.localEvento}`,
    `Data: ${formatDateShort(contractData.dataEvento)}`,
    `Horário de início: ${contractData.horarioInicio} | Horário de término: ${contractData.horarioTermino}`,
  ];

  eventDetails.forEach((detail) => {
    checkNewPage(8);
    doc.setFont("Times", "normal");
    doc.setFontSize(9);
    doc.text("•  " + detail, margin + 5, yPos);
    yPos += 5;
  });
  yPos += 3;

  // CLAUSE 2
  checkNewPage(15);
  doc.setFont("Times", "bold");
  doc.setFontSize(10);
  doc.text("CLÁUSULA 2 - DAS OBRIGAÇÕES DO CONTRATADO", margin, yPos);
  yPos += 5;

  doc.setFont("Times", "normal");
  doc.setFontSize(9);
  doc.text("2.1. O CONTRATADO compromete-se a:", margin, yPos);
  yPos += 4;

  const clause2Items = [
    "Comparecer ao local do evento na data acordada com antecedência mínima de 40 minutos;",
    "Executar seleção musical adequada ao tipo do evento, podendo incluir pedidos do CONTRATANTE;",
    "Levar seus equipamentos quando solicitado, ou utilizar estrutura fornecida pelo CONTRATANTE conforme prévio e expresso acordo;",
    "Manter postura profissional durante toda a execução do serviço.",
  ];

  clause2Items.forEach((item, index) => {
    checkNewPage(10);
    const letter = String.fromCharCode(97 + index); // a, b, c, d
    yPos = addWrappedText(
      `${letter}) ${item}`,
      margin + 5,
      yPos,
      contentWidth - 5,
      9,
    );
    yPos += 1;
  });
  yPos += 3;

  // CLAUSE 3
  checkNewPage(15);
  doc.setFont("Times", "bold");
  doc.setFontSize(10);
  doc.text("CLÁUSULA 3 - DAS OBRIGAÇÕES DO CONTRATANTE", margin, yPos);
  yPos += 5;

  doc.setFont("Times", "normal");
  doc.setFontSize(9);
  doc.text("3.1. O CONTRATANTE deverá:", margin, yPos);
  yPos += 4;

  const clause3Items = [
    "Garantir acesso ao local junto ao espaço onde será realizado o evento para montagem e desmontagem do equipamento;",
    "Disponibilizar ponto de energia adequado e seguro;",
    "Garantir condições de segurança física ao CONTRATADO e seus equipamentos;",
    "Efetuar o pagamento nas condições e prazos acordadas;",
    "Se responsabilizar por qualquer dano causado por terceiros aos equipamentos do CONTRATADO.",
  ];

  clause3Items.forEach((item, index) => {
    checkNewPage(10);
    const letter = String.fromCharCode(97 + index); // a, b, c, d, e
    yPos = addWrappedText(
      `${letter}) ${item}`,
      margin + 5,
      yPos,
      contentWidth - 5,
      9,
    );
    yPos += 1;
  });
  yPos += 3;

  // CLAUSE 4
  checkNewPage(15);
  doc.setFont("Times", "bold");
  doc.setFontSize(10);
  doc.text("CLÁUSULA 4 - DO VALOR E FORMA DE PAGAMENTO", margin, yPos);
  yPos += 5;

  doc.setFont("Times", "normal");
  doc.setFontSize(9);
  yPos = addWrappedText(
    "4.1. Pelo serviço prestado, o CONTRATANTE pagará ao CONTRATADO o valor total de R$ 4.000,00 (Quatro mil reais) que será efetuado de maneira antecipada e integralmente até a data do evento, via PIX.",
    margin,
    yPos,
    contentWidth,
    9,
  );
  yPos += 5;

  // CLAUSE 5
  checkNewPage(15);
  doc.setFont("Times", "bold");
  doc.setFontSize(10);
  doc.text("CLÁUSULA 5 - DO CANCELAMENTO", margin, yPos);
  yPos += 5;

  doc.setFont("Times", "normal");
  doc.setFontSize(9);
  doc.text(
    "5.1. Em caso de cancelamento por parte do CONTRATANTE:",
    margin,
    yPos,
  );
  yPos += 4;

  yPos = addWrappedText(
    "• Menos de 7 dias do evento: não há devolução do valor pago;",
    margin + 5,
    yPos,
    contentWidth - 5,
    9,
  );
  yPos += 1;
  yPos = addWrappedText(
    "• Em caso de força maior comprovada, as partes poderão remarcar a data sem multa.",
    margin + 5,
    yPos,
    contentWidth - 5,
    9,
  );
  yPos += 3;

  yPos = addWrappedText(
    "5.2. Em caso de cancelamento pelo CONTRATADO, todos os valores pagos deverão ser devolvidos integralmente.",
    margin,
    yPos,
    contentWidth,
    9,
  );
  yPos += 5;

  // CLAUSE 6
  checkNewPage(15);
  doc.setFont("Times", "bold");
  doc.setFontSize(10);
  doc.text("CLÁUSULA 6 - DAS CONDIÇÕES OPERACIONAIS", margin, yPos);
  yPos += 5;

  doc.setFont("Times", "normal");
  doc.setFontSize(9);
  yPos = addWrappedText(
    "6.1. Caso o evento ultrapasse o horário contratado, não será cobrada hora adicional no valor.",
    margin,
    yPos,
    contentWidth,
    9,
  );
  yPos += 3;
  yPos = addWrappedText(
    "6.2. O CONTRATANTE se responsabilizará por qualquer dano causado por terceiros aos equipamentos do CONTRATADO.",
    margin,
    yPos,
    contentWidth,
    9,
  );
  yPos += 5;

  // CLAUSE 7
  checkNewPage(15);
  doc.setFont("Times", "bold");
  doc.setFontSize(10);
  doc.text("CLÁUSULA 7 - DO USO DE IMAGEM", margin, yPos);
  yPos += 5;

  doc.setFont("Times", "normal");
  doc.setFontSize(9);
  yPos = addWrappedText(
    "7.1. O CONTRATADO está autorizado a registrar fotos e vídeos de sua apresentação para uso profissional e divulgação, salvo se o CONTRATANTE manifestar proibição por escrito.",
    margin,
    yPos,
    contentWidth,
    9,
  );
  yPos += 5;

  // CLAUSE 8
  checkNewPage(15);
  doc.setFont("Times", "bold");
  doc.setFontSize(10);
  doc.text("CLÁUSULA 8 - DA CONFIDENCIALIDADE", margin, yPos);
  yPos += 5;

  doc.setFont("Times", "normal");
  doc.setFontSize(9);
  yPos = addWrappedText(
    "8.1. Informações sensíveis do evento ou do CONTRATANTE não poderão ser divulgadas pelo CONTRATADO sem autorização prévia.",
    margin,
    yPos,
    contentWidth,
    9,
  );
  yPos += 5;

  // CLAUSE 9
  checkNewPage(15);
  doc.setFont("Times", "bold");
  doc.setFontSize(10);
  doc.text("CLÁUSULA 9 - DA RESCISÃO", margin, yPos);
  yPos += 5;

  doc.setFont("Times", "normal");
  doc.setFontSize(9);
  yPos = addWrappedText(
    "9.1. O presente contrato poderá ser rescindido por qualquer das partes mediante acordo mútuo, observando as regras de cancelamento deste documento.",
    margin,
    yPos,
    contentWidth,
    9,
  );
  yPos += 5;

  // CLAUSE 10
  checkNewPage(15);
  doc.setFont("Times", "bold");
  doc.setFontSize(10);
  doc.text("CLÁUSULA 10 - CONDIÇÕES GERAIS", margin, yPos);
  yPos += 5;

  doc.setFont("Times", "normal");
  doc.setFontSize(9);
  const clause10Items = [
    "10.1. A eventual aceitação ou tolerância, por qualquer das partes, de inexecução de quaisquer cláusulas ou condições do presente, a qualquer tempo, deverá ser interpretada como mera liberalidade, não implicando, portanto, novação, perdão, renúncia, liberação da obrigação assumida, desistência de exigir o cumprimento das disposições aqui contidas ou que o dispositivo violado possa ser considerado como cancelado ou modificado.",
    "10.2. O presente contrato e quaisquer direitos e obrigações dele decorrente, não poderão ser cedidos ou transferidos, no todo ou em parte, por qualquer Parte a não ser com a prévia e expressa anuência, por escrito, da outra Parte.",
    "10.3. O presente Contrato representa um acordo integral entre as Partes com relação ao seu objeto e substitui e expressamente revoga quaisquer acordos porventura existentes entre as Partes, expressos ou tácitos, verbais ou escritos.",
    "10.4. Este Contrato e todas as obrigações e direitos por ele conferidos obriga as Partes e seus respectivos sucessores e cessionários a partir da data de sua assinatura.",
    "10.5. As partes não serão responsáveis pelo descumprimento de suas respectivas obrigações nos termos deste Contrato em caso de qualquer evento de força maior ou caso fortuito, nos termos do artigo 393 do Código Civil brasileiro.",
    "10.6. As Partes declaram, para todos os efeitos, que são independentes e autônomas, de forma que o presente Contrato não cria qualquer outra modalidade de vínculo entre ambas, inclusive, sem limitação, mandato, sociedade, associação, parceria, consórcio, joint-venture ou representação comercial.",
  ];
  clause10Items.forEach((item) => {
    checkNewPage(12);
    yPos = addWrappedText(item, margin, yPos, contentWidth, 9);
    yPos += 3;
  });
  yPos += 2;

  // CLAUSE 11
  checkNewPage(15);
  doc.setFont("Times", "bold");
  doc.setFontSize(10);
  doc.text("CLÁUSULA 11 - DO FORO", margin, yPos);
  yPos += 5;

  doc.setFont("Times", "normal");
  doc.setFontSize(9);
  yPos = addWrappedText(
    "11.1. Para dirimir quaisquer dúvidas oriundas deste contrato, as partes elegem o foro da comarca da capital do estado de São Paulo.",
    margin,
    yPos,
    contentWidth,
    9,
  );
  yPos += 7;

  // Closing text
  checkNewPage(35); // Reservar espaço para fechamento e assinaturas
  doc.setFont("Times", "normal");
  doc.setFontSize(10);
  yPos = addWrappedText(
    "E, por estarem de pleno acordo, as partes assinam o presente contrato digitalmente.",
    margin,
    yPos,
    contentWidth,
    10,
  );
  yPos += 8;

  // Date
  const today = new Date();
  const dateExtended = formatDateExtended(today);
  doc.text(`São Paulo, ${dateExtended}`, margin, yPos);
  yPos += 15;

  // Signatures section
  const signatureBoxHeight = 25;
  const signatureY = yPos;

  // Left signature (CONTRATANTE)
  doc.setFont("Times", "normal");
  doc.setFontSize(9);

  // Signature line
  doc.setDrawColor(0, 0, 0);
  doc.line(
    margin,
    signatureY + signatureBoxHeight,
    margin + contentWidth / 2 - 5,
    signatureY + signatureBoxHeight,
  );

  // Add signature image if exists
  try {
    if (contractData.signature && contractData.signature.length > 0) {
      doc.addImage(
        contractData.signature,
        "PNG",
        margin + 10,
        signatureY,
        40,
        15,
      );
    }
  } catch (error) {
    console.warn("Erro ao adicionar assinatura:", error);
  }

  // Labels
  doc.setFont("Times", "bold");
  doc.setFontSize(9);
  doc.text(
    "CONTRATANTE",
    margin + contentWidth / 4 - 8,
    signatureY + signatureBoxHeight + 6,
    { align: "center" },
  );

  doc.setFont("Times", "normal");
  doc.setFontSize(8);
  const contractantName = contractData.nomeCompleto || "Nome do Contratante";
  doc.text(
    contractantName,
    margin + contentWidth / 4 - 8,
    signatureY + signatureBoxHeight + 11,
    { align: "center" },
  );

  // Right signature (CONTRATADO - DJ)
  doc.setFont("Times", "normal");
  doc.setFontSize(9);

  // Signature line
  doc.line(
    margin + contentWidth / 2 + 5,
    signatureY + signatureBoxHeight,
    pageWidth - margin,
    signatureY + signatureBoxHeight,
  );

  // DJ stamp/initial
  doc.setFont("Times", "italic");
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(20);
  doc.text(
    "DJ KPO",
    margin + contentWidth / 2 + contentWidth / 4 - 8,
    signatureY + 8,
    { align: "center" },
  );
  doc.setTextColor(0, 0, 0);

  // Labels
  doc.setFont("Times", "bold");
  doc.setFontSize(9);
  doc.text(
    "CONTRATADO",
    margin + contentWidth / 2 + contentWidth / 4 - 8,
    signatureY + signatureBoxHeight + 6,
    { align: "center" },
  );

  doc.setFont("Times", "normal");
  doc.setFontSize(8);
  doc.text(
    "Leonardo Capovilla - DJ-Kp0",
    margin + contentWidth / 2 + contentWidth / 4 - 8,
    signatureY + signatureBoxHeight + 11,
    { align: "center" },
  );

  return Buffer.from(doc.output("arraybuffer"));
}

// Helper functions for date formatting
function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatDateExtended(date: Date): string {
  const months = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month} de ${year}`;
}

// Adicionar data ao registro de datas ocupadas (Redis ou arquivo local)
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
        try {
          dates = JSON.parse(raw);
        } catch {
          dates = [];
        }
      }
      if (!dates.includes(date)) {
        dates.push(date);
      }
      await redis.set(REDIS_KEY, JSON.stringify(dates));
      return;
    } catch (error) {
      console.error("Erro ao salvar data no Redis:", error);
      return;
    }
  }

  // Fallback local (desenvolvimento)
  try {
    let data: { dates: string[] } = { dates: [] };
    if (fs.existsSync(DATA_FILE)) {
      const fileContent = fs.readFileSync(DATA_FILE, "utf-8");
      data = JSON.parse(fileContent);
    }
    if (!data.dates.includes(date)) {
      data.dates.push(date);
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Erro ao adicionar data ocupada:", error);
  }
}

// Enviar emails (cliente e DJ)
async function sendContractEmails(
  contractData: ContractData,
  pdfBuffer: Buffer,
) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("Email não configurado. Pulando envio de email.");
      return;
    }

    const transporter = setupEmailTransport();

    const eventDate = new Date(contractData.dataEvento);
    const formattedDate = eventDate.toLocaleDateString("pt-BR");

    // Email para o CLIENTE - Confirmação de recebimento
    const clientMailOptions = {
      from: process.env.EMAIL_USER,
      to: contractData.email,
      subject: `Contrato Recebido - ${contractData.nomeEvento}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0064c8;">Seu Contrato foi Recebido!</h2>
          <p>Olá <strong>${contractData.nomeCompleto}</strong>,</p>
          <p>Recebemos com sucesso seu contrato para o evento:</p>

          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Evento:</strong> ${contractData.nomeEvento}</p>
            <p><strong>Data:</strong> ${formattedDate}</p>
            <p><strong>Horário:</strong> ${contractData.horarioInicio} - ${contractData.horarioTermino}</p>
            <p><strong>Local:</strong> ${contractData.localEvento}</p>
          </div>

          <p>Em anexo você encontra uma cópia do seu contrato assinado.</p>
          <p>Em breve você receberá confirmação final da contratação.</p>

          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Esta é uma mensagem automática. Por favor, não responda este email.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `Contrato_${contractData.nomeEvento.replace(/\s+/g, "_")}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    // Email para o DJ - Novo contrato com PDF
    const djMailOptions = {
      from: process.env.EMAIL_USER,
      to: "guilhermepoppilm@gmail.com",
      subject: `[NOVO CONTRATO] ${contractData.nomeEvento} - ${contractData.nomeCompleto}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0064c8;">🎵 Novo Contrato Recebido!</h2>

          <div style="background-color: #e8f4f8; padding: 15px; border-radius: 5px; border-left: 4px solid #0064c8; margin: 15px 0;">
            <h3 style="margin-top: 0; color: #0064c8;">Detalhes da Solicitação</h3>

            <p><strong>👤 Cliente:</strong> ${contractData.nomeCompleto}</p>
            <p><strong>📧 Email:</strong> ${contractData.email}</p>
            <p><strong>📱 CPF:</strong> ${contractData.cpf}</p>

            <hr style="margin: 15px 0; border: none; border-top: 1px solid #999;">

            <p><strong>🎉 Evento:</strong> ${contractData.nomeEvento}</p>
            <p><strong>🎭 Tipo:</strong> ${contractData.tipoEvento}</p>
            <p><strong>📍 Local:</strong> ${contractData.localEvento}</p>
            <p><strong>📅 Data:</strong> ${formattedDate}</p>
            <p><strong>⏰ Horário:</strong> ${contractData.horarioInicio} - ${contractData.horarioTermino}</p>
          </div>

          <p style="background-color: #fff3cd; padding: 10px; border-radius: 5px; border-left: 4px solid #ffc107;">
            <strong>✅ O contrato assinado está em anexo!</strong>
          </p>

          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Sistema de Gerenciamento de Contratos - DJ KPO
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `Contrato_${contractData.nomeEvento.replace(/\s+/g, "_")}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    // Enviar ambos os emails
    await transporter.sendMail(clientMailOptions);
    console.log("✅ Email enviado para o cliente com sucesso");

    await transporter.sendMail(djMailOptions);
    console.log("✅ Email enviado para o DJ com sucesso");
  } catch (error) {
    console.error("❌ Erro ao enviar emails:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const data: ContractData = await request.json();

    // Validate required fields
    const requiredFields = [
      "nomeCompleto",
      "cpf",
      "email",
      "nomeEvento",
      "tipoEvento",
      "localEvento",
      "dataEvento",
      "horarioInicio",
      "horarioTermino",
      "signature",
    ];

    for (const field of requiredFields) {
      if (!data[field as keyof ContractData]) {
        return NextResponse.json(
          { message: `Campo obrigatório ausente: ${field}` },
          { status: 400 },
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({ message: "Email inválido" }, { status: 400 });
    }

    // Validate CPF format (basic check)
    const cpfClean = data.cpf.replace(/\D/g, "");
    if (cpfClean.length !== 11) {
      return NextResponse.json({ message: "CPF inválido" }, { status: 400 });
    }

    // Format date for display
    const eventDate = new Date(data.dataEvento);
    const formattedDate = eventDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const dateString = data.dataEvento.split("T")[0];

    // Log contract submission
    console.log("=== NOVO CONTRATO RECEBIDO ===");
    console.log("Cliente:", data.nomeCompleto);
    console.log("CPF:", data.cpf);
    console.log("Email:", data.email);
    console.log("Evento:", data.nomeEvento);
    console.log("Tipo:", data.tipoEvento);
    console.log("Local:", data.localEvento);
    console.log("Data:", formattedDate);
    console.log("Horário:", `${data.horarioInicio} - ${data.horarioTermino}`);
    console.log("Assinatura recebida:", data.signature ? "Sim" : "Não");
    console.log("==============================");

    // Gerar PDF do contrato
    console.log("📄 Gerando PDF do contrato...");
    const pdfBuffer = generateContractPDF(data);
    console.log("✅ PDF gerado com sucesso");

    // Marcar data como ocupada ANTES de enviar email (mais crítico)
    await addOccupiedDate(dateString);
    console.log("✅ Data marcada como ocupada:", dateString);

    // Enviar emails — falha não cancela o contrato
    console.log("📧 Enviando emails...");
    let emailError: string | null = null;
    try {
      await sendContractEmails(data, pdfBuffer);
      console.log("✅ Emails enviados com sucesso");
    } catch (err) {
      emailError = err instanceof Error ? err.message : String(err);
      console.error(
        "❌ Erro ao enviar emails (contrato já registrado):",
        emailError,
      );
    }

    return NextResponse.json({
      success: true,
      message: "Contrato enviado com sucesso",
      emailError,
      data: {
        cliente: data.nomeCompleto,
        evento: data.nomeEvento,
        data: formattedDate,
      },
    });
  } catch (error) {
    console.error("Erro ao processar contrato:", error);
    return NextResponse.json(
      { message: "Erro interno ao processar contrato" },
      { status: 500 },
    );
  }
}
