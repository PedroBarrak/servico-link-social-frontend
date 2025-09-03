import React, { useState, useEffect } from "react";
import { GetDoacoesByOngId } from "../../Api";
import "./UsuarioOng.css";

export default function OngUsuario({ dados }) {
  const [doacoes, setDoacoes] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nome: dados?.nome || "",
    telefone: dados?.telefone || "",
    email: dados?.email || "",
    cpf: dados?.cpf || "",
    cnpj: dados?.cnpj || "",
    descricao: "",
  });


  useEffect(() => {
    async function carregarDoacoes() {
      if (dados?.id) {
        const lista = await GetDoacoesByOngId(dados.id);
        setDoacoes(lista);
      }
    }
    carregarDoacoes();
  }, [dados?.id]);

  useEffect(() => {
    const descricaoSalva = localStorage.getItem(`descricao_ong_${dados?.id}`);
    if (descricaoSalva) {
      setFormData((prev) => ({ ...prev, descricao: descricaoSalva }));
    }
  }, [dados?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const salvarDados = () => {
    if (!formData.descricao.trim()) {
      alert("Por favor, descreva um pouco a ONG.");
      return;
    }
    localStorage.setItem(`descricao_ong_${dados?.id}`, formData.descricao);

    setEditando(false);
    alert("Perfil da ONG atualizado com sucesso!");
  };

  const tipoDoacaoTexto = (tipo) =>
    ({ 1: "Única", 2: "Mensal - 6x", 3: "Mensal - 12x" }[tipo] || "Desconhecido");

  const statusTexto = (status) =>
    ({ 0: "Pendente", 1: "Pago", 2: "Cancelado" }[status] ?? "Desconhecido");

  const statusClasse = (status) =>
    ({ 0: "status-pendente", 1: "status-pago", 2: "status-cancelado" }[status] ?? "");

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="usuario-container">
      <section className="accordion-section">
        <button
          className="accordion-header"
          onClick={() => setEditando(!editando)}
        >
          Perfil da ONG
          <span>{editando ? "-" : "+"}</span>
        </button>

        {editando ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              salvarDados();
            }}
            className="form-dados"
          >
            <label>
              Nome:
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="input-dados"
              />
            </label>

            <label>
              Telefone:
              <input
                type="text"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="input-dados"
              />
            </label>

            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-dados"
              />
            </label>

            <label>
              CNPJ:
              <input
                type="text"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                className="input-dados"
              />
            </label>

            <label>
              Sobre a ONG:
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows="6"
                className="textarea-beneficio"
                placeholder="Digite aqui informações sobre sua ONG..."
              />
            </label>

            <div className="botoes-salvar-cancelar">
              <button type="submit" className="btn-salvar">
                Salvar
              </button>
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => setEditando(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="lista-beneficios-container">
            <p><strong>Nome:</strong> {formData.nome}</p>
            <p><strong>Telefone:</strong> {formData.telefone}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            {formData.cpf && <p><strong>CPF:</strong> {formData.cpf}</p>}
            {formData.cnpj && <p><strong>CNPJ:</strong> {formData.cnpj}</p>}
            <p><strong>Sobre a ONG:</strong></p>
            <p>{formData.descricao || "Nenhuma descrição cadastrada."}</p>

            <button
              className="btn-editar"
              onClick={() => setEditando(true)}
            >
              Editar Perfil da ONG
            </button>
          </div>
        )}
      </section>
        {/* {*werqweqweqwewq*} */}
      <section className="accordion-section">
        <button className="accordion-header" type="button">
          Minhas Doações Recebidas
        </button>
        <div className="lista-doacoes-container">
          {doacoes.length === 0 ? (
            <p>Sua ONG ainda não recebeu doações.</p>
          ) : (
            <ul className="lista-doacoes-compacta">
              {doacoes.map((d) => (
                <li
                  key={d.id}
                  className={`card-doacao ong ${expanded[d.id] ? "expanded" : ""}`}
                >
                  <div className="doacao-summary" onClick={() => toggleExpand(d.id)}>
                    <p><strong>Doador:</strong> {d.nomeDoador ?? "Anônimo"}</p>
                    <p><strong>Valor:</strong> R$ {(d.valor ?? 0).toFixed(2)}</p>
                    <p className={statusClasse(d.statusPagamento)}>
                      <strong>Status:</strong> {statusTexto(d.statusPagamento)}
                    </p>
                    <span className="expand-icon">{expanded[d.id] ? "▲" : "▼"}</span>
                  </div>
                  {expanded[d.id] && (
                    <div className="doacao-detalhes">
                      <p><strong>Benefício:</strong> {d.descricaoBeneficio ?? "-"}</p>
                      <p><strong>Tipo:</strong> {tipoDoacaoTexto(d.tipoDoacao)}</p>
                      {d.comentario && d.comentario.trim() !== "" && (
                        <div className="comentario">
                          <strong>Comentário:</strong> {d.comentario}
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
