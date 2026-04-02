"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ContractData {
  nomeCompleto: string
  cpf: string
  email: string
  nomeEvento: string
  tipoEvento: string
  localEvento: string
  dataEvento: Date | null
  horarioInicio: string
  horarioTermino: string
}

interface ContractPreviewProps {
  data: ContractData
  signature: string | null
}

export function ContractPreview({ data, signature }: ContractPreviewProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return "____/____/________"
    return format(date, "dd/MM/yyyy", { locale: ptBR })
  }

  const formatDateExtended = (date: Date | null) => {
    if (!date) return "________________"
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  }

  const today = new Date()

  return (
    <div className="bg-white text-black p-8 md:p-12 rounded-lg shadow-lg max-w-3xl mx-auto font-serif">
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
        <h1 className="text-2xl font-bold tracking-wide mb-2">
          CONTRATO DE PRESTAÇÃO DE SERVIÇOS
        </h1>
        <h2 className="text-lg text-gray-600">
          DISCOTECAGEM E ILUMINAÇÃO
        </h2>
      </div>

      {/* Introduction */}
      <div className="mb-6 text-sm leading-relaxed text-justify">
        <p>
          Pelo presente instrumento particular, as partes abaixo identificadas:
        </p>
      </div>

      {/* Parties */}
      <div className="mb-6 text-sm leading-relaxed">
        <div className="mb-4 p-4 bg-gray-50 rounded">
          <p className="font-bold mb-2">CONTRATANTE:</p>
          <p><strong>Nome:</strong> {data.nomeCompleto || "________________________"}</p>
          <p><strong>CPF:</strong> {data.cpf || "________________________"}</p>
          <p><strong>Email:</strong> {data.email || "________________________"}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded">
          <p className="font-bold mb-2">CONTRATADO (DEEJAY):</p>
          <p><strong>Nome:</strong> Leonardo Capovilla</p>
          <p><strong>Nome artístico:</strong> DJ-Kp0</p>
        </div>
      </div>

      <p className="mb-6 text-sm">Têm entre si justo e contratado o que segue:</p>

      {/* Clauses */}
      <div className="space-y-6 text-sm leading-relaxed text-justify">
        {/* Clause 1 */}
        <div>
          <h3 className="font-bold mb-2">CLÁUSULA 1 - DO OBJETO</h3>
          <p className="mb-2">
            1.1. O presente contrato tem como objeto a prestação de serviços de
            discotecagem (Deejay) pelo CONTRATADO no evento descrito a seguir:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Nome do evento:</strong> {data.nomeEvento || "________________________"}</li>
            <li><strong>Tipo do evento:</strong> {data.tipoEvento || "________________________"}</li>
            <li><strong>Local:</strong> {data.localEvento || "________________________"}</li>
            <li><strong>Data:</strong> {formatDate(data.dataEvento)}</li>
            <li><strong>Horário de início:</strong> {data.horarioInicio || "__:__"} | <strong>Horário de término:</strong> {data.horarioTermino || "__:__"}</li>
          </ul>
        </div>

        {/* Clause 2 */}
        <div>
          <h3 className="font-bold mb-2">CLÁUSULA 2 - DAS OBRIGAÇÕES DO CONTRATADO</h3>
          <p className="mb-2">2.1. O CONTRATADO compromete-se a:</p>
          <ul className="list-[lower-alpha] pl-6 space-y-1">
            <li>Comparecer ao local do evento na data acordada com antecedência mínima de 40 minutos;</li>
            <li>Executar seleção musical adequada ao tipo do evento, podendo incluir pedidos do CONTRATANTE;</li>
            <li>Levar seus equipamentos quando solicitado, ou utilizar estrutura fornecida pelo CONTRATANTE conforme prévio e expresso acordo;</li>
            <li>Manter postura profissional durante toda a execução do serviço.</li>
          </ul>
        </div>

        {/* Clause 3 */}
        <div>
          <h3 className="font-bold mb-2">CLÁUSULA 3 - DAS OBRIGAÇÕES DO CONTRATANTE</h3>
          <p className="mb-2">3.1. O CONTRATANTE deverá:</p>
          <ul className="list-[lower-alpha] pl-6 space-y-1">
            <li>Garantir acesso ao local junto ao espaço onde será realizado o evento para montagem e desmontagem do equipamento;</li>
            <li>Disponibilizar ponto de energia adequado e seguro;</li>
            <li>Garantir condições de segurança física ao CONTRATADO e seus equipamentos;</li>
            <li>Efetuar o pagamento nas condições e prazos acordadas;</li>
            <li>Se responsabilizar por qualquer dano causado por terceiros aos equipamentos do CONTRATADO.</li>
          </ul>
        </div>

        {/* Clause 4 */}
        <div>
          <h3 className="font-bold mb-2">CLÁUSULA 4 - DO VALOR E FORMA DE PAGAMENTO</h3>
          <p>
            4.1. Pelo serviço prestado, o CONTRATANTE pagará ao CONTRATADO o valor total
            de <strong>R$ 4.000,00 (Quatro mil reais)</strong> que será efetuado de maneira antecipada
            e integralmente até a data do evento, via PIX.
          </p>
        </div>

        {/* Clause 5 */}
        <div>
          <h3 className="font-bold mb-2">CLÁUSULA 5 - DO CANCELAMENTO</h3>
          <p className="mb-2">5.1. Em caso de cancelamento por parte do CONTRATANTE:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Menos de 7 dias do evento: não há devolução do valor pago;</li>
            <li>Em caso de força maior comprovada, as partes poderão remarcar a data sem multa.</li>
          </ul>
          <p className="mt-2">
            5.2. Em caso de cancelamento pelo CONTRATADO, todos os valores pagos
            deverão ser devolvidos integralmente.
          </p>
        </div>

        {/* Clause 6 */}
        <div>
          <h3 className="font-bold mb-2">CLÁUSULA 6 - DO USO DE IMAGEM</h3>
          <p>
            6.1. O CONTRATADO está autorizado a registrar fotos e vídeos de sua
            apresentação para uso profissional e divulgação, salvo se o CONTRATANTE
            manifestar proibição por escrito.
          </p>
        </div>

        {/* Clause 7 */}
        <div>
          <h3 className="font-bold mb-2">CLÁUSULA 7 - DO FORO</h3>
          <p>
            7.1. Para dirimir quaisquer dúvidas oriundas deste contrato, as partes elegem o
            foro da comarca da capital do estado de São Paulo.
          </p>
        </div>
      </div>

      {/* Closing */}
      <div className="mt-8 text-sm">
        <p className="mb-8 text-justify">
          E, por estarem de pleno acordo, as partes assinam o presente contrato digitalmente.
        </p>

        <p className="mb-8">
          São Paulo, {formatDateExtended(today)}
        </p>

        {/* Signatures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="text-center">
            <div className="border-b-2 border-black h-20 mb-2 flex items-end justify-center pb-2">
              {signature && (
                <img src={signature} alt="Assinatura" className="max-h-16 max-w-full object-contain" />
              )}
            </div>
            <p className="font-bold">CONTRATANTE</p>
            <p className="text-xs text-gray-600">{data.nomeCompleto || "Nome do Contratante"}</p>
          </div>
          <div className="text-center">
            <div className="border-b-2 border-black h-20 mb-2 flex items-end justify-center pb-2">
              <span className="text-xl font-bold italic text-gray-400">DJ KPO</span>
            </div>
            <p className="font-bold">CONTRATADO</p>
            <p className="text-xs text-gray-600">Leonardo Capovilla - DJ-Kp0</p>
          </div>
        </div>
      </div>
    </div>
  )
}
