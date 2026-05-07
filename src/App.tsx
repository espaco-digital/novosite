/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  MessageCircle, 
  Mail, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Shuffle,
  Gamepad2,
  Image as ImageIcon,
  Video,
  ArrowUp
} from 'lucide-react';

// --- Constantes e Dados ---

interface Post {
  id: string;
  title: string;
  content: string;
}

const INITIAL_POSTS: Post[] = [
  {
    id: 'post_octopus',
    title: "O Mimetismo dos Polvos",
    content: "Os polvos são verdadeiros mestres do disfarce. Eles possuem células especializadas chamadas cromatóforos, que permitem mudar a cor, o padrão e até a textura da pele em menos de um segundo. Além de se camuflarem para escapar de predadores, eles usam essas mudanças para se comunicar e caçar. É um dos sistemas de camuflagem mais avançados e rápidos do reino animal."
  },
  { 
    id: 'post_1',
    title: "A Memória dos Corvos", 
    content: "Os corvos são extremamente inteligentes e conseguem reconhecer e lembrar de rostos humanos. Se uma pessoa os ameaçar, eles não apenas guardarão rancor por anos, como também irão comunicar isso ao resto do bando. O grupo inteiro pode passar a hostilizar aquela pessoa específica, mesmo que os outros corvos nunca a tenham visto antes." 
  },
  { 
    id: 'post_2',
    title: "O Uivo dos Lobos", 
    content: "Ao contrário da imagem clássica dos cinemas, os lobos não uivam para a lua cheia. Eles uivam para se comunicar: seja para reunir a matilha, alertar rivais sobre os limites de seu território ou coordenar uma caçada. O motivo de levantarem a cabeça para o céu é puramente prático, pois a postura ajuda o som a viajar por distâncias muito maiores." 
  },
  {
    id: 'post_3',
    title: "O Sono dos Golfinhos",
    content: "Golfinhos têm uma forma de dormir fascinante chamada sono uni-hemisférico. Eles literalmente desligam apenas metade do cérebro por vez, enquanto a outra metade permanece alerta para respirar e observar a aproximação de predadores. Inclusive, enquanto uma metade dorme, o olho oposto permanece aberto!"
  }
];

const LEGENDAS_CASUAIS = [
  "Testando roupas e técnicas de edição ao mesmo tempo.",
  "Treinando com o irmão no Arsenal Maromba.",
  "Resenha com os amigos no apê do Lucas transformado em anime pelo GPT.",
  "Trilha do Guardião em Queluz. Passamos por vários poços de água cristalina na companhia da Bárbara.",
  "Mais um dia de forró com os amigos na Casa da Mãe Tiana."
];

// URLs simuladas para fins de demonstração (baseadas no repositório do usuário)
const FOTOS_DATA = Array.from({ length: 8 }, (_, i) => `https://picsum.photos/seed/ed_${i}/800/600`);

export default function App() {
  const [tabIndex, setTabIndex] = useState(0);
  const [heroTextIdx, setHeroTextIdx] = useState(0);
  const heroTitles = ["Seja Bem Vindo(a) ao", "Site Pessoal de Wesley!"];

  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [isSobreOpen, setIsSobreOpen] = useState(false);
  
  // Mídias Dropdown e Toast
  const [isMidiasOpen, setIsMidiasOpen] = useState(false);
  const [showEmBreve, setShowEmBreve] = useState(false);
  
  // Grupos de Mídia
  const [fotosGroup, setFotosGroup] = useState(0); // 0: Casuais, 1: Portifólio
  const [videosGroup, setVideosGroup] = useState(0); // 0: Dança, 1: Portifólio
  
  const [isFotosOpen, setIsFotosOpen] = useState(false);
  const [isVideosOpen, setIsVideosOpen] = useState(false);
  const [isJogosOpen, setIsJogosOpen] = useState(false);

  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [lightboxPost, setLightboxPost] = useState<Post | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showPopup, setShowPopup] = useState<{ type: 'whatsapp' | 'email'; value: string } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroTextIdx((prev) => (prev + 1) % heroTitles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shufflePosts = () => {
    const newPosts = [...posts];
    for (let i = newPosts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPosts[i], newPosts[j]] = [newPosts[j], newPosts[i]];
    }
    setPosts(newPosts);
  };

  const triggerEmBreve = () => {
    setShowEmBreve(true);
    setTimeout(() => setShowEmBreve(false), 2000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 100;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMidiasOpen(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado para a área de transferência!');
    setShowPopup(null);
  };

  return (
    <div className="min-h-screen bg-[#2F3D48] text-[#cfdde9] font-sans selection:bg-[#6c7c89] selection:text-white pb-20">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-10" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23ffffff' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")` }} 
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#2F3D48]/70 backdrop-blur-md px-4 pt-[10px] pb-[4px] shadow-lg border-b border-white/5">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          <div className="flex items-center justify-center relative w-full h-9">
            <div className="flex-1 flex bg-[#4a5e6c] rounded-lg overflow-hidden h-full shadow-inner p-1 max-w-[800px] w-full">
              <button 
                onClick={() => setTabIndex(0)}
                className={`flex-1 rounded-md text-sm font-semibold transition-all z-0 ${tabIndex === 0 ? 'bg-[#6c7c89] text-white shadow' : 'text-[#a0aec0] hover:text-white'}`}
              >
                Inicial
              </button>
              <div className="w-24 shrink-0" /> {/* Espaço reservado para o botão Entrar */}
              <button 
                onClick={() => setTabIndex(1)}
                className={`flex-1 rounded-md text-sm font-semibold transition-all z-0 ${tabIndex === 1 ? 'bg-[#6c7c89] text-white shadow' : 'text-[#a0aec0] hover:text-white'}`}
              >
                Posts
              </button>
            </div>
            {/* Botão Entrar Centralizado e Sobreposto */}
            <button className="absolute left-1/2 -translate-x-1/2 z-10 bg-[#6c7c89] hover:bg-[#8495a3] text-white px-4 h-7 rounded-lg text-sm font-bold shadow-md transition-all active:scale-95 border border-white/10">
              Entrar
            </button>
          </div>

          <nav className="flex justify-center gap-3 pt-0 -mt-3 relative">
            <button 
              onClick={triggerEmBreve}
              className="bg-[#4a5e6c]/80 hover:bg-[#6c7c89] px-6 h-7 rounded-full text-sm font-medium transition-all hover:-translate-y-0.5 border border-white/10 flex items-center justify-center -mr-2.5"
            >
              Portfólio
            </button>
            <button 
              onClick={() => scrollToSection('contato')}
              className="bg-[#4a5e6c]/80 hover:bg-[#6c7c89] w-10 h-7 rounded-full transition-all border border-white/10 flex items-center justify-center"
            >
              <Mail size={16} />
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsMidiasOpen(!isMidiasOpen)}
                className="bg-[#4a5e6c]/80 hover:bg-[#6c7c89] px-6 h-7 rounded-full text-sm font-medium transition-all hover:-translate-y-0.5 border border-white/10 flex items-center justify-center -ml-2.5"
              >
                Mídias
              </button>
              
              <AnimatePresence>
                {isMidiasOpen && (
                  <>
                    <div className="fixed inset-0 z-[-1]" onClick={() => setIsMidiasOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[#4a5e6c] rounded-xl shadow-2xl border border-white/10 overflow-hidden min-w-[120px] z-50"
                    >
                      {['Fotos', 'Vídeos', 'Jogos'].map((item) => (
                        <button 
                          key={item}
                          onClick={() => scrollToSection(item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-[#6c7c89] transition-colors text-[#cfdde9] hover:text-white font-medium"
                        >
                          {item}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </div>
      </header>

      <main className="w-full overflow-hidden mt-8">
        <div 
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]"
          style={{ transform: `translateX(-${tabIndex * 50}%)`, width: '200%' }}
        >
          {/* ABA INICIAL */}
          <div className="w-1/2 flex-shrink-0 px-4 space-y-6 pt-0 -mt-4">
            {/* Hero */}
            <section className="text-center py-0 mt-4 mb-4 pb-[6px]">
              <motion.p 
                animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="font-serif text-5xl font-bold p-0 m-0 mb-1.5 h-12 leading-[48px] text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
              >
                Espaço Digital
              </motion.p>
              <h1 className="text-[#c9d6e2] text-sm md:text-base font-normal">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={heroTextIdx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {heroTitles[heroTextIdx]}
                  </motion.span>
                </AnimatePresence>
              </h1>
            </section>

            {/* Descrição */}
            <section className="max-w-3xl mx-auto mt-[27px]">
              <h2 className="font-serif text-2xl font-bold text-[#a0aec0] text-left mb-0 cursor-pointer hover:text-white transition-all" 
                  onClick={() => setIsSobreOpen(!isSobreOpen)}>
                Descrição
              </h2>
              <div className="relative">
                <img 
                  src="https://raw.githubusercontent.com/espaco-digital/espaco-digital.github.io/main/espacodigital/imagens/minhafoto.png" 
                  alt="Wesley" 
                  className="absolute bottom-full right-0 w-24 h-auto z-10 mb-[-14px]" 
                />
                <motion.div 
                  className="bg-[#4a5e6c] p-5 rounded-[20px] shadow-lg overflow-hidden relative cursor-pointer mt-0"
                  animate={{ height: isSobreOpen ? 'auto' : '165px' }}
                  onClick={() => setIsSobreOpen(!isSobreOpen)}
                >
                  <div className="space-y-4 text-[#cfdde9] text-base leading-relaxed text-left">
                    <p>Página pessoal, mas também profissional. Feita para livre-expressão, exposição de fotos, vídeos, projetos e portfólios em andamento.</p>
                    <div className="pt-4 border-t border-white/5">
                      <h3 className="font-bold text-[#a0aec0] mb-2 text-lg text-center">Sobre Mim</h3>
                      <p className="text-left">Tenho noções de design gráfico, embora seja mais dedicado à edição de vídeo. Sou entusiasta das IAs. Gosto de dançar a dois, práticas outdoor, e explorar novas tecnologias.</p>
                    </div>
                  </div>
                {!isSobreOpen && (
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#4a5e6c] via-[#4a5e6c]/90 to-transparent pointer-events-none rounded-b-[20px]" />
                )}
              </motion.div>
            </div>
          </section>

            {/* Prévia Posts */}
            <section className="max-w-3xl mx-auto">
              <div 
                className="font-serif text-2xl font-bold text-[#a0aec0] text-left mb-0 cursor-pointer hover:text-white transition-all"
                onClick={() => setTabIndex(1)}
              >
                Posts
              </div>
              <div 
                className="bg-[#4a5e6c] p-6 rounded-[20px] shadow-lg relative h-[165px] overflow-hidden cursor-pointer group border border-white/5 hover:border-white/20 transition-all"
                onClick={() => setTabIndex(1)}
              >
                <p className="text-[#cfdde9] italic">"{posts[0]?.content}"</p>
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#4a5e6c] to-transparent pointer-events-none rounded-b-[20px]" />
              </div>
            </section>

            <section id="fotos" className="max-w-3xl mx-auto">
              <h2 className="font-serif text-2xl font-bold text-[#a0aec0] text-left mb-0 cursor-pointer hover:text-white transition-all"
                  onClick={() => setIsFotosOpen(!isFotosOpen)}>
                Fotos
              </h2>
              <div className="bg-[#4a5e6c] rounded-[20px] shadow-lg relative overflow-hidden">
                <div className="p-5 flex items-center justify-between py-0">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFotosGroup(prev => prev === 0 ? 1 : 0); }}
                    className="text-[#6c7c89] hover:text-[#cfdde9] transition-colors p-1"
                  >
                    <ChevronLeft size={32} strokeWidth={1} />
                  </button>
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => setIsFotosOpen(!isFotosOpen)}
                  >
                    <div className="text-center text-[#a0aec0] text-sm font-light">{fotosGroup === 0 ? 'Casuais' : 'Portifólio'}</div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFotosGroup(prev => (prev + 1) % 2); }}
                    className="text-[#6c7c89] hover:text-[#cfdde9] transition-colors p-1"
                  >
                    <ChevronRight size={32} strokeWidth={1} />
                  </button>
                </div>
                
                {!isFotosOpen && (
                  <div 
                    className="px-5 pb-5 cursor-pointer"
                    onClick={() => setIsFotosOpen(!isFotosOpen)}
                  >
                    <div className="flex justify-center gap-2 mb-2 relative">
                      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <span className="text-[#cfdde9] text-sm font-semibold drop-shadow-md">(clique para expandir)</span>
                      </div>
                      <div className="flex gap-2 opacity-50 blur-[1px]">
                        {(fotosGroup === 0 ? FOTOS_DATA : []).slice(0, 4).map((foto, i) => (
                          <img key={i} src={foto} className="w-16 h-12 object-cover rounded shadow" alt="" />
                        ))}
                        {fotosGroup === 1 && <div className="w-16 h-12 bg-black/20 rounded flex items-center justify-center"><ImageIcon size={16} /></div>}
                      </div>
                    </div>
                  </div>
                )}

                <AnimatePresence>
                  {isFotosOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 pb-5"
                    >
                      {fotosGroup === 0 ? (
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-[#2F3D48] scrollbar-thumb-[#6c7c89]">
                          {FOTOS_DATA.map((foto, i) => (
                            <div key={i} className="flex-none w-64 group">
                              <div 
                                className="h-80 rounded-xl overflow-hidden shadow-lg border-2 border-white/5 transition-transform group-hover:scale-[1.02] cursor-pointer"
                                onClick={() => setLightboxImg(foto)}
                              >
                                <img src={foto} alt="" className="w-full h-full object-cover" />
                              </div>
                              {LEGENDAS_CASUAIS[i] && (
                                <p className="mt-3 text-sm text-[#a0aec0] leading-snug line-clamp-2 text-center">{LEGENDAS_CASUAIS[i]}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-10 text-center text-[#a0aec0]">Em breve...</div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* Vídeos */}
            <section id="videos" className="max-w-3xl mx-auto">
              <h2 className="font-serif text-2xl font-bold text-[#a0aec0] text-left mb-0 cursor-pointer hover:text-white transition-all"
                  onClick={() => setIsVideosOpen(!isVideosOpen)}>
                Vídeos
              </h2>
              <div className="bg-[#4a5e6c] rounded-[20px] shadow-lg relative overflow-hidden">
                <div className="p-5 flex items-center justify-between py-0">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setVideosGroup(prev => prev === 0 ? 1 : 0); }}
                    className="text-[#6c7c89] hover:text-[#cfdde9] transition-colors p-1"
                  >
                    <ChevronLeft size={32} strokeWidth={1} />
                  </button>
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => setIsVideosOpen(!isVideosOpen)}
                  >
                    <div className="text-center text-[#a0aec0] text-sm font-light">{videosGroup === 0 ? 'Dança' : 'Portifólio'}</div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setVideosGroup(prev => (prev + 1) % 2); }}
                    className="text-[#6c7c89] hover:text-[#cfdde9] transition-colors p-1"
                  >
                    <ChevronRight size={32} strokeWidth={1} />
                  </button>
                </div>

                {!isVideosOpen && (
                  <div 
                    className="px-5 pb-5 cursor-pointer"
                    onClick={() => setIsVideosOpen(!isVideosOpen)}
                  >
                    <div className="flex justify-center gap-2 relative">
                      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <span className="text-[#cfdde9] text-sm font-semibold drop-shadow-md">(clique para expandir)</span>
                      </div>
                      <div className="flex gap-2 opacity-50 blur-[1px]">
                        <div className="w-16 h-12 bg-black/40 rounded flex items-center justify-center"><Video size={16} /></div>
                        <div className="w-16 h-12 bg-black/40 rounded flex items-center justify-center"><Video size={16} /></div>
                      </div>
                    </div>
                  </div>
                )}

                <AnimatePresence>
                  {isVideosOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 pb-5"
                    >
                      {videosGroup === 0 ? (
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-[#2F3D48] scrollbar-thumb-[#6c7c89]">
                          {[
                            "https://www.youtube.com/embed/mw86Wn5zDzM",
                            "https://www.youtube.com/embed/ncMmDCHRHpU"
                          ].map((src, i) => (
                            <div key={i} className="flex-none w-[280px] aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-xl border-2 border-white/5">
                              <iframe 
                                src={src} 
                                className="w-full h-full" 
                                allowFullScreen
                                title={`Video ${i}`}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-10 text-center text-[#a0aec0]">Em breve...</div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* Jogos */}
            <section id="jogos" className="max-w-3xl mx-auto">
              <h2 className="font-serif text-2xl font-bold text-[#a0aec0] text-left mb-0 cursor-pointer hover:text-white transition-all"
                  onClick={() => setIsJogosOpen(!isJogosOpen)}>
                Jogos
              </h2>
              <motion.div 
                className="bg-[#4a5e6c] rounded-[20px] shadow-lg relative overflow-hidden"
              >
                <div 
                  className="p-5 cursor-pointer"
                  onClick={() => setIsJogosOpen(!isJogosOpen)}
                >
                  {!isJogosOpen && (
                    <div className="flex justify-center gap-2 relative">
                      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <span className="text-[#cfdde9] text-sm font-semibold drop-shadow-md">(clique para expandir)</span>
                      </div>
                      <div className="flex gap-2 opacity-50 blur-[1px]">
                        <div className="w-16 h-12 bg-black/40 rounded flex items-center justify-center"><Gamepad2 size={16} /></div>
                      </div>
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {isJogosOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 pb-5 flex justify-center"
                    >
                      <a 
                        href="#" 
                        className="block w-full max-w-[280px] bg-[#2F3D48] rounded-xl overflow-hidden shadow-xl hover:scale-105 transition-transform"
                      >
                        <img 
                          src="https://raw.githubusercontent.com/espaco-digital/espaco-digital.github.io/main/espacodigital/imagens/ZBDisplay.png" 
                          alt="Zona de Batalha" 
                          className="w-full h-40 object-contain"
                        />
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </section>

            {/* Contato */}
            <section id="contato" className="max-w-3xl mx-auto !mb-20">
              <h2 className="font-serif text-2xl font-bold text-[#a0aec0] text-left mb-0">Contato</h2>
              <div className="bg-[#4a5e6c] p-6 rounded-[20px] shadow-lg flex justify-center gap-4 flex-wrap">
                <SocialIcon 
                  icon={<MessageCircle size={28} />} 
                  color="bg-green-600" 
                  onClick={() => setShowPopup({ type: 'whatsapp', value: '12997558993' })}
                />
                <SocialIcon 
                  icon={<Mail size={28} />} 
                  color="bg-red-500" 
                  onClick={() => setShowPopup({ type: 'email', value: 'wesley.anunnaki@gmail.com' })}
                />
                <SocialIcon icon={<Instagram size={28} />} color="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600" onClick={() => window.open('https://www.instagram.com/wesley.buenno', '_blank')} />
                <SocialIcon icon={<Facebook size={28} />} color="bg-blue-600" onClick={() => window.open('https://www.facebook.com/Wesley.Bueno', '_blank')} />
                <SocialIcon icon={<span className="font-bold text-xl">d</span>} color="bg-black" onClick={() => window.open('https://www.tiktok.com/@wesfbs', '_blank')} />
                <SocialIcon icon={<Youtube size={28} />} color="bg-red-600" onClick={() => window.open('https://www.youtube.com/@Wesley-FBS', '_blank')} />
              </div>
            </section>
          </div>

          {/* ABA POSTS */}
          <div className="w-1/2 flex-shrink-0 px-4 py-8 space-y-6">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="font-serif text-2xl font-bold text-[#a0aec0]">Postagens</h2>
                <button 
                  onClick={shufflePosts}
                  className="bg-[#4a5e6c] hover:bg-[#6c7c89] p-2 rounded-full transition-all text-white shadow-md active:rotate-180 duration-500"
                >
                  <Shuffle size={20} />
                </button>
              </div>

              {posts.map((post) => (
                <motion.article 
                  key={post.id}
                  layout
                  className="bg-[#4a5e6c] p-6 rounded-[20px] shadow-lg relative overflow-hidden group cursor-pointer border border-white/5 hover:border-white/20 transition-all h-[180px]"
                  onClick={() => setLightboxPost(post)}
                >
                  <h3 className="font-serif text-xl font-bold text-white mb-3">{post.title}</h3>
                  <p className="text-[#cfdde9] leading-relaxed line-clamp-3">{post.content}</p>
                  
                  {/* Fade-out inferior nos cards de post */}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#4a5e6c] via-[#4a5e6c]/80 to-transparent pointer-events-none rounded-b-[20px]" />
                  
                  <div className="absolute bottom-4 right-6 flex gap-2 z-10">
                    <span className="bg-[#2F3D48]/60 p-1 rounded-md">👍</span>
                    <span className="bg-[#2F3D48]/60 p-1 rounded-md">👎</span>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Lightbox Foto */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxImg(null)}
          >
            <button className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full">
              <X size={32} />
            </button>
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={lightboxImg} 
              className="max-w-full max-h-full rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Post */}
      <AnimatePresence>
        {lightboxPost && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setLightboxPost(null)}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-[#2F3D48] max-w-2xl w-full p-8 rounded-3xl shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 text-[#a0aec0] hover:text-white transition-colors"
                onClick={() => setLightboxPost(null)}
              >
                <X size={28} />
              </button>
              <h2 className="font-serif text-3xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                {lightboxPost.title}
              </h2>
              <div className="text-lg leading-relaxed space-y-4 text-[#cfdde9]">
                {lightboxPost.content.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popup Contato */}
      <AnimatePresence>
        {showPopup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowPopup(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#4a5e6c] p-8 rounded-3xl shadow-2xl border border-white/10 text-center max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-lg font-bold mb-6">O que deseja fazer?</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => copyToClipboard(showPopup.value)}
                  className="bg-[#6c7c89] hover:bg-[#8495a3] text-white py-3 rounded-xl font-bold transition-all"
                >
                  Copiar {showPopup.type === 'whatsapp' ? 'WhatsApp' : 'Email'}
                </button>
                <button 
                  onClick={() => window.open(showPopup.type === 'whatsapp' ? `https://wa.me/55${showPopup.value}` : `mailto:${showPopup.value}`, '_blank')}
                  className="bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold transition-all"
                >
                  Abrir Aplicativo
                </button>
                <button 
                  onClick={() => setShowPopup(null)}
                  className="text-[#a0aec0] hover:text-white mt-2 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 left-6 z-[60] bg-[#6c7c89] text-white p-3 rounded-full shadow-lg hover:bg-[#8495a3] transition-colors"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Toast Em Breve */}
      <AnimatePresence>
        {showEmBreve && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] bg-[#2F3D48]/95 text-white px-8 py-4 rounded-2xl shadow-2xl border border-[#6c7c89] font-bold text-xl"
          >
            Em breve!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SocialIcon({ icon, color, onClick }: { icon: React.ReactNode, color: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-14 h-14 rounded-full ${color} flex items-center justify-center text-white shadow-lg transition-transform hover:scale-125 active:scale-95`}
    >
      {icon}
    </button>
  );
}
