"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ContractData {
  nomeCompleto: string;
  cpf: string;
  email: string;
  nomeEvento: string;
  tipoEvento: string;
  localEvento: string;
  dataEvento: Date | null;
  horarioInicio: string;
  horarioTermino: string;
}

interface ContractPreviewProps {
  data: ContractData;
  signature: string | null;
}

export function ContractPreview({ data, signature }: ContractPreviewProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return "____/____/________";
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  const formatDateExtended = (date: Date | null) => {
    if (!date) return "________________";
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const today = new Date();

  return (
    <div className="bg-white text-black p-8 md:p-12 rounded-lg shadow-lg max-w-3xl mx-auto font-serif">
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
        <img
          src="/dj-kpo-logo.png"
          alt="DJ KPO"
          className="h-16 mx-auto mb-4 object-contain"
        />
        <h1 className="text-2xl font-bold tracking-wide mb-2">
          CONTRATO DISCOTECAGEM E ILUMINAÇÃO
        </h1>
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
          <p className="font-bold mb-2">
            CONTRATANTE: {data.nomeCompleto || "________________________"}
          </p>
          <p>
            <strong>CPF/CNPJ:</strong> {data.cpf || "________________________"}
          </p>
          <p>
            <strong>Email:</strong> {data.email || "________________________"}
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded">
          <p className="font-bold mb-2">CONTRATADO (DEEJAY):</p>
          {signature ? (
            <>
              <p>Nome: Leonardo Capovilla</p>
              <p>Nome artístico: DJ-Kp0</p>
              <p>CPF: 215.714.098-07</p>
              <p>Residente no endereço: Rua Juaguaré, 216</p>
              <p>Chave pix para pagamento: lojaaloehas@gmail.com</p>
            </>
          ) : (
            <p className="text-gray-400 italic text-xs">
              Dados do contratado serão exibidos após a assinatura do contrato.
            </p>
          )}
        </div>
      </div>

      <p className="mb-6 text-sm">
        Têm entre si justo e contratado o que segue:
      </p>

      {/* Clauses */}
      <div className="space-y-6 text-sm leading-relaxed text-justify">
        {/* Clause 1 */}
        <div>
          <h3 className="font-bold mb-2">CLÁUSULA 1 – DO OBJETO</h3>
          <p className="mb-2">
            1.1. O presente contrato tem como objeto a prestação de serviços de
            discotecagem (Deejay) pelo CONTRATADO no evento descrito a seguir:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Nome do evento:</strong>{" "}
              {data.nomeEvento || "________________________"}
            </li>
            <li>
              <strong>Tipo do evento:</strong>{" "}
              {data.tipoEvento || "________________________"}
            </li>
            <li>
              <strong>Local:</strong>{" "}
              {data.localEvento || "________________________"}
            </li>
            <li>
              <strong>Data:</strong> {formatDate(data.dataEvento)}
            </li>
            <li>
              <strong>Horário de início:</strong>{" "}
              {data.horarioInicio || "__:__"} {"  "}
              <strong>Horário de término:</strong>{" "}
              {data.horarioTermino || "__:__"}
            </li>
          </ul>
        </div>

        {/* Clause 2 */}
        <div>
          <h3 className="font-bold mb-2">
            CLÁUSULA 2 – DAS OBRIGAÇÕES DO CONTRATADO
          </h3>
          <p className="mb-2">2.1. O CONTRATADO compromete-se a:</p>
          <p>
            a) Comparecer ao local do evento na data{" "}
            {formatDate(data.dataEvento)} com antecedência mínima de 40 minutos;
          </p>
          <p>
            b) Executar seleção musical adequada ao tipo do evento, podendo
            incluir pedidos do CONTRATANTE;
          </p>
          <p>
            c) Levar seus equipamentos quando solicitado, ou utilizar estrutura
            fornecida pelo CONTRATANTE conforme prévio e expresso acordo;
          </p>
          <p>
            d) Manter postura profissional durante toda a execução do serviço.
          </p>
        </div>

        {/* Clause 3 */}
        <div>
          <h3 className="font-bold mb-2">
            CLÁUSULA 3 – DAS OBRIGAÇÕES DO CONTRATANTE
          </h3>
          <p className="mb-2">3.1. O CONTRATANTE deverá:</p>
          <p>
            a) Garantir acesso ao local junto ao espaço onde será realizado o
            evento para montagem e desmontagem do equipamento;
          </p>
          <p>b) Disponibilizar ponto de energia adequado e seguro;</p>
          <p>
            c) Garantir condições de segurança física ao CONTRATADO e seus
            equipamentos;
          </p>
          <p>
            d) Efetuar o pagamento nas condições e prazos acordadas, na clausula
            4 abaixo.
          </p>
          <p>
            e) O CONTRATANTE se responsabilizar por qualquer dano causado por
            terceiros aos equipamentos do CONTRATADO.
          </p>
        </div>

        {/* Clause 4 */}
        <div>
          <h3 className="font-bold mb-2">
            CLÁUSULA 4 – DO VALOR E FORMA DE PAGAMENTO
          </h3>
          <p>
            4.1. Pelo serviço prestado, o CONTRATANTE pagará ao CONTRATADO o
            valor total de <strong>R$ 4.000,00 (Quatro mil reais)</strong> que
            será efetuado de maneira antecipada e integralmente até a véspera do
            evento, na forma de pix, na chave pix:{" "}
            <strong>lojaaloehas@gmail.com</strong>.
          </p>
        </div>

        {/* Clause 5 */}
        <div>
          <h3 className="font-bold mb-2">CLÁUSULA 5 – DO CANCELAMENTO</h3>
          <p className="mb-2">
            5.1. Em caso de cancelamento por parte do CONTRATANTE:
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-2">
            <li>
              Menos de 7 dias do evento: <strong>não há devolução</strong> do
              valor pago;
            </li>
            <li>
              Em caso de força maior comprovada, as partes poderão remarcar a
              data sem multa.
            </li>
          </ul>
          <p>
            5.2. Em caso de cancelamento pelo CONTRATADO, todos os valores pagos
            deverão ser devolvidos integralmente, além do compromisso de indicar
            substituto de mesmo nível profissional, se possível.
          </p>
        </div>

        {/* Clause 6 */}
        <div>
          <h3 className="font-bold mb-2">
            CLÁUSULA 6 – DAS CONDIÇÕES OPERACIONAIS
          </h3>
          <p className="mb-1">
            6.1. Caso o evento ultrapasse o horário contratado, não será cobrada
            hora adicional no valor.
          </p>
          <p>
            6.2. Cláusula de obrigações do CONTRATANTE: se responsabilizará por
            qualquer dano causado por terceiros aos equipamentos do CONTRATADO.
          </p>
        </div>

        {/* Clause 7 */}
        <div>
          <h3 className="font-bold mb-2">CLÁUSULA 7 – DO USO DE IMAGEM</h3>
          <p>
            7.1. O CONTRATADO está autorizado a registrar fotos e vídeos de sua
            apresentação para uso profissional e divulgação, salvo se o
            CONTRATANTE manifestar proibição por escrito.
          </p>
        </div>

        {/* Clause 8 */}
        <div>
          <h3 className="font-bold mb-2">CLÁUSULA 8 – DA CONFIDENCIALIDADE</h3>
          <p>
            8.1. Informações sensíveis do evento ou do CONTRATANTE não poderão
            ser divulgadas pelo CONTRATADO sem autorização prévia.
          </p>
        </div>

        {/* Clause 9 */}
        <div>
          <h3 className="font-bold mb-2">CLÁUSULA 9 – DA RESCISÃO</h3>
          <p>
            9.1. O presente contrato poderá ser rescindido por qualquer das
            partes mediante acordo mútuo, observando as regras de cancelamento
            deste documento.
          </p>
        </div>

        {/* Clause 10 */}
        <div>
          <h3 className="font-bold mb-2">CLÁUSULA 10 – CONDIÇÕES GERAIS</h3>
          <p className="mb-2">
            10.1. A eventual aceitação ou tolerância, por qualquer das partes,
            de inexecução de quaisquer cláusulas ou condições do presente, a
            qualquer tempo, deverá ser interpretada como mera liberalidade, não
            implicando, portanto, novação, perdão, renúncia, liberação da
            obrigação assumida, desistência de exigir o cumprimento das
            disposições aqui contidas ou que o dispositivo violado possa ser
            considerado como cancelado ou modificado.
          </p>
          <p className="mb-2">
            10.2. O presente contrato e quaisquer direitos e obrigações dele
            decorrente, não poderão ser cedidos ou transferidos, no todo ou em
            parte, por qualquer Parte a não ser com a prévia e expressa
            anuência, por escrito, da outra Parte.
          </p>
          <p className="mb-2">
            10.3. O presente Contrato representa um acordo integral entre as
            Partes com relação ao seu objeto e substitui e expressamente revoga
            quaisquer acordos porventura existentes entre as Partes, expressos
            ou tácitos, verbais ou escritos.
          </p>
          <p className="mb-2">
            10.4. Este Contrato e todas as obrigações e direitos por ele
            conferidos obriga as Partes e seus respectivos sucessores e
            cessionários a partir da data de sua assinatura.
          </p>
          <p className="mb-2">
            10.5. As partes não serão responsáveis pelo descumprimento de suas
            respectivas obrigações nos termos deste Contrato em caso de qualquer
            evento de força maior ou caso fortuito, nos termos do artigo 393 do
            Código Civil brasileiro.
          </p>
          <p>
            10.6. As Partes declaram, para todos os efeitos, que são
            independentes e autônomas, de forma que o presente Contrato não cria
            qualquer outra modalidade de vínculo entre ambas, inclusive, sem
            limitação, mandato, sociedade, associação, parceria, consórcio,
            joint-venture ou representação comercial, sendo cada Parte
            totalmente responsável por seus atos e obrigações assumidos por meio
            deste Contrato, não tendo nenhuma autoridade ou poder para, direta
            ou indiretamente, negociar, contratar, assumir qualquer tipo de
            obrigação ou criar responsabilidade em nome da outra Parte, com
            exceção das expressamente dispostas neste Contrato.
          </p>
        </div>

        {/* Clause 11 */}
        <div>
          <h3 className="font-bold mb-2">CLÁUSULA 11 – DO FORO</h3>
          <p>
            11.1. Para dirimir quaisquer dúvidas oriundas deste contrato, as
            partes elegem o foro da comarca da capital do estado de São Paulo.
          </p>
        </div>
      </div>

      {/* Closing */}
      <div className="mt-8 text-sm">
        <p className="mb-6 text-justify font-bold">
          E, por estarem de pleno acordo, as partes assinam o presente contrato
          em duas vias de igual teor.
        </p>

        <p className="mb-8 font-bold">São Paulo, {formatDateExtended(today)}</p>

        {/* Signatures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="text-center">
            <div className="border-b-2 border-black h-20 mb-2 flex items-end justify-center pb-2">
              {signature && (
                <img
                  src={signature}
                  alt="Assinatura"
                  className="max-h-16 max-w-full object-contain"
                />
              )}
            </div>
            <p className="font-bold">CONTRATANTE</p>
            <p className="text-xs text-gray-600">
              {data.nomeCompleto || "Nome do Contratante"}
            </p>
          </div>
          <div className="text-center">
            <div className="border-b-2 border-black h-20 mb-2 flex items-end justify-center pb-2">
              <span className="text-xl font-bold italic text-gray-400">
                DJ KPO
              </span>
            </div>
            <p className="font-bold">CONTRATADO</p>
            <p className="text-xs text-gray-600">Leonardo Capovilla - DJ-Kp0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
