"use client";
import { API_BASE_URL } from "@/utils/apiConfig";
import Image from "next/image";
import NavBar from "@/components/NavBarPaciente";
import perfil from "../../../../public/images/perfil.png";
import { Card } from "@/components/Card";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import NavBarGerente from "@/components/NavBarGerente";
import NavBarColaborador from "@/components/NavBarColaborador";
import NavBarPaciente from "@/components/NavBarPaciente";
import Form from "@/components/Form Autenticacao/Form";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  // const searchParams = useSearchParams();
  // const id = searchParams.get("id");
  // const acesso = searchParams.get("acs");

  const params = useParams();
  const id = params.id;

  const router = useRouter();

  const [userrEmail, setUserrEmail] = useState("");
  const [userID, setUserID] = useState("");
  const [pacienteInfo, setPacienteInfo] = useState<any | null>(null);
  const [homeLink, setHomeLink] = useState("");

  const [memberID, setMemberID] = useState("");
  const [acesso, setAcesso] = useState("");

  const [imagemData, setImageData] = useState<string>("");
  const [documents, setDocuments] = useState<string[]>([]);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    // const id = localStorage.getItem("userID");
    const acs = localStorage.getItem("acs");
    const homeLink = localStorage.getItem("homeLink");

    if (id) fetchPacienteData(id);

    if (email) setUserrEmail(email);
    if (homeLink) setHomeLink(homeLink);
    if (acs) {
      setAcesso(acs)
      localStorage.removeItem("acs");
    };
  })

  const fetchPacienteData = async (id: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pacientes/id/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch gerente data");
      }
      const data = await response.json();
      setPacienteInfo(data);
    } catch (error) {
      console.error("Error fetching gerente data:", error);
    }
  };
  // Puxa a foto de perfil e os documentos
  useEffect(() => {
    if (pacienteInfo?.fotofile) {
      const fotoNome = pacienteInfo.fotofile.slice(8);
      fetchFotoData(fotoNome);
    }
    if (pacienteInfo?.rgdocfile) {
      const rgFileNome = pacienteInfo.rgdocfile.slice(8);
      fetchDocumentsData(rgFileNome);
    }
    if (pacienteInfo?.relescolar) {
      const relescolarFileNome = pacienteInfo.relescolar.slice(8);
      fetchDocumentsData(relescolarFileNome);
    }
    if (pacienteInfo?.laudofile) {
      const laudoFileNome = pacienteInfo.laudofile.slice(8);
      fetchDocumentsData(laudoFileNome);
    }
    if (pacienteInfo?.compresfile) {
      const compresFileNome = pacienteInfo.compresfile.slice(8);
      fetchDocumentsData(compresFileNome);
    }
  }, [pacienteInfo]);

  const fetchFotoData = async (fotoNome: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/imagens/${fotoNome}`);
      if (!response.ok) {
        throw new Error('Fetch falhou');
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageData(imageUrl);
    } catch (error) {
      console.error('Erro ao buscar imagem:', error);
    }
  };

  const fetchDocumentsData = async (docNome: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/imagens/${docNome}`);
      if (!response.ok) {
        throw new Error('Fetch falhou');
      }

      const docBlob = await response.blob();
      const docUrl = URL.createObjectURL(docBlob);
      setDocuments(documentos => [...documentos, docUrl]);
    } catch (error) {
      console.error('Erro ao buscar imagem:', error);
    }
  };

  // Se a pessoa que clicou no card for um gerente, ou seja "acs" = "g" recebe navbar de gerente, caso contrario colaborador
  const getAcesso = () => {
    if (acesso === "g") return <NavBarGerente />
    if (acesso === "c") return <NavBarColaborador />
    if (acesso === "p") return <NavBarPaciente />
  }

  return (
    <main className="flex flex-col min-h-screen">
      {getAcesso()}
      <div className="flex flex-col gap-[20px] px-[108px] pt-[33px] pb-[50px] text-[14px]">
        <div className="flex gap-[20px]">
          <div className="box w-3/5 flex flex-col gap-7">
            <div className="w-full flex flex-row justify-between">
              <h2>Cadastro de {pacienteInfo ? pacienteInfo.nome : "Nome"}</h2>
              {/* {(acesso === "g" || acesso === "c") ? (
                                pacienteInfo && !pacienteInfo.analise ? (
                                    <button type="button" className="py-2 px-3 bg-blue-800 text-white rounded-lg font-medium -mr-2">Verificar</button>
                                ) : (
                                    <button type="button" className="bg-black/10 text-black/50 py-2 px-3 rounded-lg font-medium -mr-2" disabled>Verificado</button>
                                )
                            ) : null} */}
              {pacienteInfo && pacienteInfo.analise ? (
                <button type="button" className="py-2 px-3 bg-blue-800 text-white rounded-lg font-medium -mr-2" onClick={() => router.push(`/autenticacao/${id}`)}>Verificar</button>
              ) : (
                <button type="button" className="bg-black/10 text-black/50 py-2 px-3 rounded-lg font-medium -mr-2" disabled>Verificado</button>
              )}
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-[20px]">
                <Image
                  src={imagemData || perfil}
                  alt='foto de perfil <nome do usuario>'
                  width={68}
                  height={68} />

                <div>
                  <p className="titulo">Nome e Sobrenome:</p>
                  <p>{pacienteInfo ? pacienteInfo.nome : "Nome"}</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col gap-6">
                  <div>
                    <p className="titulo">RG:</p>
                    <p>{pacienteInfo ? pacienteInfo.rg : "RG"}</p>
                  </div>

                  <div>
                    <p className="titulo">CPF:</p>
                    <p>{pacienteInfo ? pacienteInfo.cpf : "CPF"}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div>
                    <p className="titulo">Data de nascimento:</p>
                    <p>{pacienteInfo && pacienteInfo.nascimentodata ? pacienteInfo.nascimentodata : "Nascimento"}</p>
                  </div>

                  <div>
                    <p className="titulo">Endereço:</p>
                    <p>{pacienteInfo && pacienteInfo.geral ? pacienteInfo.geral.endereco : "Endereço"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="box w-2/5">
            <h3>Profissionais que acompanham</h3>

            <div className="flex flex-col">
              <Card hasBorder={false} />
              <Card hasBorder={false} />
              <Card hasBorder={false} />
            </div>
          </div>
        </div>

        <div className="flex gap-[20px]">
          <div className="gap-[18px] box w-full">
            <h3>Mãe</h3>
            <p className="titulo">{pacienteInfo && pacienteInfo.mae ? pacienteInfo.mae.nome : "Nome da mãe"}</p>

            <div className="flex flex-row gap-[18px] items-start">
              <div className="flex flex-col gap-5">
                <div>
                  <p className="titulo">RG:</p>
                  <p>{pacienteInfo && pacienteInfo.mae ? pacienteInfo.mae.rg : "RG da mãe"}</p>
                </div>

                <div>
                  <p className="titulo">CPF:</p>
                  <p>{pacienteInfo && pacienteInfo.mae ? pacienteInfo.mae.cpf : "CPF da mãe"}</p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <p className="titulo">Data de nascimento:</p>
                  <p>{pacienteInfo && pacienteInfo.mae ? pacienteInfo.mae.data : "Nascimento da mãe"}</p>
                </div>

                <div>
                  <p className="titulo">Contato:</p>
                  <p>{pacienteInfo && pacienteInfo.mae ? pacienteInfo.mae.telefone : "Telefone da mãe"}</p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <p className="titulo">Escolaridade:</p>
                  <p>{pacienteInfo && pacienteInfo.mae ? pacienteInfo.mae.escolaridade : "Escolaridade da mãe"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="gap-[18px] box w-full">
            <h3>Pai</h3>
            <p className="titulo">{pacienteInfo && pacienteInfo.pai ? pacienteInfo.pai.nome : "Nome do pai"}</p>

            <div className="flex flex-row gap-[18px] items-start">
              <div className="flex flex-col gap-5">
                <div>
                  <p className="titulo">RG:</p>
                  <p>{pacienteInfo && pacienteInfo.pai ? pacienteInfo.pai.rg : "RG do pai"}</p>
                </div>

                <div>
                  <p className="titulo">CPF:</p>
                  <p>{pacienteInfo && pacienteInfo.pai ? pacienteInfo.pai.cpf : "CPF do pai"}</p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <p className="titulo">Data de nascimento:</p>
                  <p>{pacienteInfo && pacienteInfo.pai ? pacienteInfo.pai.data : "Nascimento do pai"}</p>
                </div>

                <div>
                  <p className="titulo">Contato:</p>
                  <p>{pacienteInfo && pacienteInfo.pai ? pacienteInfo.pai.telefone : "Telefone do pai"}</p>
                </div>
              </div>

              <div className="flex flex-col gap-5 justify-start">
                <div>
                  <p className="titulo">Escolaridade:</p>
                  <p>{pacienteInfo && pacienteInfo.pai ? pacienteInfo.pai.escolaridade : "Escolaridade do pai"}</p>
                </div>

                <div>
                  <p className="titulo">Contato:</p>
                  <p>{pacienteInfo && pacienteInfo.pai ? pacienteInfo.pai.telefone : "Telefone do pai"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="box w-full">
          <h3>Documentos do Paciente</h3>
          {documents.length > 0 ? (
            <ul className="list-disc pl-5">
              {documents.map((doc: any, index: number) => (
                <li key={index} className="py-2">
                  <a
                    href={`${API_BASE_URL}/documentos/${doc.nomeArquivo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {doc.nomeArquivo}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Nenhum documento cadastrado.</p>
          )}
        </div> */}
      </div>
    </main>
  );
}
