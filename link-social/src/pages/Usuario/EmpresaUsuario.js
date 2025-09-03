import React, { useState, useEffect } from "react";
import "./Usuario.css";

export default function EmpresaUsuario({ dados }) {
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
    // Carrega descrição da empresa do localStorage (simulando a API)
    const descricaoSalva = localStorage.getItem(`descricao_empresa_${dados?.id}`);
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
      alert("Por favor, descreva um pouco a empresa.");
      return;
    }
    // Simula salvar descrição
    localStorage.setItem(`descricao_empresa_${dados?.id}`, formData.descricao);

    // Aqui você poderia chamar uma função da API para salvar os outros dados
    // ex: await apiUpdateUsuario(formData);

    setEditando(false);
    alert("Perfil atualizado com sucesso!");
  };

  return (
    <div className="usuario-container">
      <section className="accordion-section">
        <button
          className="accordion-header"
          onClick={() => setEditando(!editando)}
        >
          Perfil da Empresa
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
              CPF:
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
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
              Sobre a empresa:
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows="6"
                className="textarea-beneficio"
                placeholder="Digite aqui informações sobre sua empresa..."
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
            <p><strong>Sobre a empresa:</strong></p>
            <p>{formData.descricao || "Nenhuma descrição cadastrada."}</p>

            <button
              className="btn-editar"
              onClick={() => setEditando(true)}
            >
              Editar Perfil
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
