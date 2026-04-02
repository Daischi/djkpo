import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

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

// Adicionar data ao arquivo de datas ocupadas
function addOccupiedDate(date: string) {
  try {
    let data = { dates: [] };
    if (fs.existsSync(DATA_FILE)) {
      const fileContent = fs.readFileSync(DATA_FILE, "utf-8");
      data = JSON.parse(fileContent);
    }

    // Evitar duplicatas
    if (!data.dates.includes(date)) {
      data.dates.push(date);
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Erro ao adicionar data ocupada:", error);
  }
}

// Enviar email com a assinatura
async function sendContractEmail(contractData: ContractData) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("Email não configurado. Pulando envio de email.");
      return;
    }

    const transporter = setupEmailTransport();

    // Email para o DJ
    const djMailOptions = {
      from: process.env.EMAIL_USER,
      to: "guilhermepoppilm@gmail.com",
      subject: `Novo Contrato Recebido - ${contractData.nomeEvento}`,
      html: `
        <h2>Novo Contrato Recebido</h2>
        <p><strong>Cliente:</strong> ${contractData.nomeCompleto}</p>
        <p><strong>Email:</strong> ${contractData.email}</p>
        <p><strong>Evento:</strong> ${contractData.nomeEvento}</p>
        <p><strong>Tipo:</strong> ${contractData.tipoEvento}</p>
        <p><strong>Local:</strong> ${contractData.localEvento}</p>
        <p><strong>Data:</strong> ${new Date(contractData.dataEvento).toLocaleDateString("pt-BR")}</p>
        <p><strong>Horário:</strong> ${contractData.horarioInicio} - ${contractData.horarioTermino}</p>
        <hr>
        <h3>Assinatura do Cliente:</h3>
        <img src="${contractData.signature}" alt="Assinatura" style="max-width: 300px; border: 1px solid #ccc; padding: 10px;">
      `,
    };

    await transporter.sendMail(djMailOptions);
    console.log("Email enviado para o DJ com sucesso");
  } catch (error) {
    console.error("Erro ao enviar email:", error);
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

    // Adicionar data ao arquivo de datas ocupadas
    addOccupiedDate(dateString);

    // Enviar email para o DJ
    await sendContractEmail(data);

    return NextResponse.json({
      success: true,
      message: "Contrato enviado com sucesso",
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
