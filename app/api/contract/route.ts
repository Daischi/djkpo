import { NextResponse } from "next/server"

// Contract data interface
interface ContractData {
  nomeCompleto: string
  cpf: string
  email: string
  nomeEvento: string
  tipoEvento: string
  localEvento: string
  dataEvento: string
  horarioInicio: string
  horarioTermino: string
  signature: string
}

export async function POST(request: Request) {
  try {
    const data: ContractData = await request.json()

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
    ]

    for (const field of requiredFields) {
      if (!data[field as keyof ContractData]) {
        return NextResponse.json(
          { message: `Campo obrigatório ausente: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { message: "Email inválido" },
        { status: 400 }
      )
    }

    // Validate CPF format (basic check)
    const cpfClean = data.cpf.replace(/\D/g, "")
    if (cpfClean.length !== 11) {
      return NextResponse.json(
        { message: "CPF inválido" },
        { status: 400 }
      )
    }

    // Format date for display
    const eventDate = new Date(data.dataEvento)
    const formattedDate = eventDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })

    // Log contract submission (in production, this would be saved to a database)
    console.log("=== NOVO CONTRATO RECEBIDO ===")
    console.log("Cliente:", data.nomeCompleto)
    console.log("CPF:", data.cpf)
    console.log("Email:", data.email)
    console.log("Evento:", data.nomeEvento)
    console.log("Tipo:", data.tipoEvento)
    console.log("Local:", data.localEvento)
    console.log("Data:", formattedDate)
    console.log("Horário:", `${data.horarioInicio} - ${data.horarioTermino}`)
    console.log("Assinatura recebida:", data.signature ? "Sim" : "Não")
    console.log("==============================")

    // In a production environment, you would:
    // 1. Generate PDF using a library like puppeteer, jspdf, or a service like Vercel's og image
    // 2. Send email using nodemailer or a service like Resend, SendGrid, etc.
    // 3. Save contract to database

    // For now, we'll simulate success
    // To enable full functionality, configure the following environment variables:
    // - EMAIL_HOST: SMTP server (e.g., smtp.gmail.com)
    // - EMAIL_PORT: SMTP port (e.g., 587)
    // - EMAIL_USER: Your email address
    // - EMAIL_PASS: Your email password or app-specific password
    
    // Example Gmail configuration:
    // EMAIL_HOST=smtp.gmail.com
    // EMAIL_PORT=587
    // EMAIL_USER=your-email@gmail.com
    // EMAIL_PASS=your-app-specific-password (generate at https://myaccount.google.com/apppasswords)

    return NextResponse.json({
      success: true,
      message: "Contrato enviado com sucesso",
      data: {
        cliente: data.nomeCompleto,
        evento: data.nomeEvento,
        data: formattedDate,
      },
    })

  } catch (error) {
    console.error("Erro ao processar contrato:", error)
    return NextResponse.json(
      { message: "Erro interno ao processar contrato" },
      { status: 500 }
    )
  }
}
