
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sword, 
  Crown, 
  Mail, 
  Lock, 
  User, 
  LayoutDashboard, 
  Settings, 
  Scroll, 
  Dices,
  LogOut,
  ChevronLeft,
  Zap,
  Shield,
  Box,
  Book,
  Grid,
  Cloud,
  PenTool,
  Send,
  Backpack,
  Skull,
  Heart,
  Search,
  Upload,
  Trophy,
  Activity,
  Newspaper,
  PlusCircle,
  BookOpen,
  BarChart3,
  History
} from 'lucide-react';
import { GamerInput, GamerButton, GamerCard } from './components/UI';
import { PixelGrid } from './components/PixelGrid';
import { BauhausCard } from './components/bauhaus-card';
import { CharacterSheet, Character } from './components/CharacterSheet';
import { MasterScreen } from './components/MasterScreen';
import { supabase } from './lib/supabase'; // Importação do cliente Supabase

// Types for Chat
interface ChatMessage {
  id: number;
  sender: string;
  role: 'gm' | 'player' | 'system' | 'npc';
  time: string;
  text: React.ReactNode; 
  type: 'narrative' | 'system' | 'dialogue' | 'narrative_danger' | 'roll';
}

// Types for View State
type ViewState = 'login' | 'recovery' | 'role-select' | 'signup-gm' | 'signup-player' | 'dashboard';
type UserType = 'master' | 'player' | null;

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('login');
  const [userType, setUserType] = useState<UserType>(null);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // State lifted up for background color logic
  const [activeTab, setActiveTab] = useState('dashboard');

  // --- SUPABASE AUTH LISTENER ---
  useEffect(() => {
    // Verificar sessão atual ao carregar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      }
    });

    // Escutar mudanças de auth (login, logout, etc)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
        setUserType(null);
        setView('login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return;
      }

      if (data) {
        setUserProfile(data);
        setUserType(data.role); // 'master' ou 'player'
        setView('dashboard');
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
    }
  };

  // MOCK DATA: Character based on SQL structure
  // TODO: Em uma implementação futura, carregar isso do Supabase (tabela 'characters')
  const playerChar: Character = {
    id: 'uuid-123',
    name: userProfile?.name || 'Pirlim', // Usa o nome do perfil se disponível
    class: 'Ladino',
    subclass: 'Assassino',
    race: 'Halfling',
    level: 11,
    xp: 45000,
    hp_current: 88,
    hp_max: 110,
    ac: 2,
    thac0: 15,
    movement: 9,
    avatar_url: 'https://i.imgur.com/L5mnOPQ.png', // Pixel Art Halfling
    alignment: 'Caótico Neutro',
    deity: 'Brandobaris',
    attributes: {
      strength: 18,
      strength_percentile: 45,
      dexterity: 17,
      constitution: 15,
      intelligence: 12,
      wisdom: 11,
      charisma: 10
    },
    saving_throws: {
      poison: 10,
      rod: 12,
      petrification: 9,
      breath: 13,
      spell: 11
    },
    thief_skills: [
      { skill: 'Furtar Bolsos', value: 95 },
      { skill: 'Abrir Fechaduras', value: 85 },
      { skill: 'Achar Armadilhas', value: 70 },
      { skill: 'Mover em Silêncio', value: 99 },
      { skill: 'Esconder-se', value: 90 },
      { skill: 'Ouvir Ruídos', value: 60 },
      { skill: 'Escalar Muros', value: 92 },
      { skill: 'Ler Línguas', value: 45 },
    ],
    // Detailed Inventory with weights
    equipment: [
      { item_name: 'Adaga +2', slot: 'Mão Primária', quantity: 1, is_equipped: true, weight: 1, type: 'weapon', damage: '1d4+2', speed: 2, size: 'P' },
      { item_name: 'Arco Curto', slot: 'Mão Secundária', quantity: 1, is_equipped: true, weight: 2, type: 'weapon', damage: '1d6', speed: 7, size: 'M' },
      { item_name: 'Couro Batido +1', slot: 'Corpo', quantity: 1, is_equipped: true, weight: 7, type: 'armor', ac_bonus: 3 },
      { item_name: 'Kit de Ladrão', slot: 'Bolsa', quantity: 1, is_equipped: false, weight: 1, type: 'common' },
      { item_name: 'Poção de Cura', slot: 'Cinto', quantity: 3, is_equipped: false, weight: 0.5, type: 'potion' },
      { item_name: 'Corda (15m)', slot: 'Mochila', quantity: 1, is_equipped: false, weight: 5, type: 'common' },
      { item_name: 'Tochas', slot: 'Mochila', quantity: 5, is_equipped: false, weight: 2, type: 'common' },
      { item_name: 'Ração de Viagem', slot: 'Mochila', quantity: 7, is_equipped: false, weight: 3, type: 'common' },
      { item_name: 'Anel de Invisibilidade', slot: 'Dedo', quantity: 1, is_equipped: true, weight: 0, type: 'magic' },
    ],
    // New fields for full sheet
    notes: [
      { date: '12/10/24', text: 'Encontramos o mapa na tumba do Rei Esqueleto.', type: 'Campanha' },
      { date: '13/10/24', text: 'Devo 50po para o taverneiro de Águas Profundas.', type: 'Manual' },
      { date: '15/10/24', text: 'Subiu para o nível 11! +1d6 HP.', type: 'Sistema' },
    ],
    languages: ['Comum', 'Halfling', 'Gíria de Ladrão', 'Goblin'],
    weapon_skills: [
      { name: 'Adaga', level: 'Especialista', bonus: '+1', note: 'Crit 19-20' },
      { name: 'Arco Curto', level: 'Proficiente', bonus: '0', note: '' },
    ],
    general_skills: [
      { name: 'Avaliação', stat: 'INT', value: 12, note: '+2 para gemas' },
      { name: 'Acrobacia', stat: 'DES', value: 16, note: 'Queda suave' },
    ],
    ac_breakdown: [
      { source: 'Base', value: 10 },
      { source: 'Destreza', value: -3 },
      { source: 'Armadura', value: -4 },
      { source: 'Anel', value: -1 },
    ],
    ammo: [
      { name: 'Flecha de Guerra', quantity: 28, damage: '1d8' },
      { name: 'Molotov', quantity: 6, damage: '1d6+1' },
      { name: 'Faca', quantity: 6, damage: '1d4+1' },
    ],
    money: {
      pp: 0,
      gp: 1250,
      ep: 50,
      sp: 300,
      cp: 45
    },
    spells: {
      slots: {
        1: { base: 0, extra: 0, used: 0 },
      },
      memorized: []
    },
    encumbrance: {
      current: 21.5,
      max: 60
    }
  };

  // Simulating a layout effect
  useEffect(() => {
    // Reset scroll on view change
    window.scrollTo(0, 0);
  }, [view]);

  // --- Auth Handlers ---
  
  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      // O useEffect do onAuthStateChange vai lidar com o redirecionamento
    } catch (error: any) {
      alert(`Erro no login: ${error.message}`);
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirm = e.target.confirm.value;

    if (password !== confirm) {
      alert("As senhas não conferem!");
      setLoading(false);
      return;
    }

    try {
      // 1. Criar usuário no Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      if (data.user) {
        // 2. Criar perfil na tabela pública
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id, 
              name: name,
              role: userType || 'player', // 'master' ou 'player'
              avatar_url: '', // Pode adicionar padrão
            }
          ]);

        if (profileError) throw profileError;

        alert("Cadastro realizado! Verifique seu e-mail ou faça login.");
        setView('login');
      }
    } catch (error: any) {
      alert(`Erro no cadastro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleSignupTypeSelect = (type: UserType) => {
    setUserType(type);
    setView(type === 'master' ? 'signup-gm' : 'signup-player');
  };

  const getPixelThemeColor = () => {
    // Telas de Autenticação
    if (['login', 'recovery', 'role-select', 'signup-gm', 'signup-player'].includes(view)) {
      return '#dc2626'; // Vermelho padrão da marca
    }

    // Dashboard e Navegação Interna
    if (view === 'dashboard') {
      if (activeTab === 'mesa') return '#facc15'; // Amarelo
      if (activeTab === 'ficha') return '#22d3ee'; // Ciano/Azul
      if (activeTab === 'master-screen') return '#9333ea'; // Roxo
      if (activeTab === 'dashboard') return '#dc2626'; // Vermelho
    }

    return '#52525b'; // Zinco (fallback)
  };

  // --- Sub-components (GameTable, Settings) ---
  // (Mantidos iguais, apenas recebendo dados reais se necessário)

  const GameTableView: React.FC<{ userType: UserType }> = ({ userType }) => {
    const [diceQty, setDiceQty] = useState<number>(1);
    const [chatInput, setChatInput] = useState('');
    const [customRollStr, setCustomRollStr] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const isGM = userType === 'master';

    // Mock Chat Data
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
      { id: 1, sender: 'MESTRE', role: 'gm', time: '11:01', text: 'Uma sombra se move no canto do seu olho. Role percepção.', type: 'narrative' },
      { id: 3, sender: 'ELARA', role: 'player', time: '11:02', text: 'Eu preparo meu arco, só por precaução.', type: 'dialogue' },
      { id: 4, sender: 'GOBLIN', role: 'npc', time: '', text: '"Você nunca vai me derrotar!" o goblin grita.', type: 'narrative_danger' },
    ]);

    useEffect(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, [chatHistory]);

    // --- Game Logic Functions ---

    const addChatMessage = (role: ChatMessage['role'], text: React.ReactNode, type: ChatMessage['type'] = 'dialogue') => {
      const newMessage: ChatMessage = {
        id: Date.now(),
        sender: role === 'gm' ? 'MESTRE' : (role === 'system' ? 'SISTEMA' : playerChar.name),
        role: role,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: text,
        type: type
      };
      setChatHistory(prev => [...prev, newMessage]);
    };

    const handleRoll = (sides: number) => {
      const rolls = [];
      let total = 0;
      for (let i = 0; i < diceQty; i++) {
        const val = Math.floor(Math.random() * sides) + 1;
        rolls.push(val);
        total += val;
      }

      const rollText = (
        <span>
          Rolou <span className="text-gamer-highlight font-mono font-bold">{diceQty}d{sides}</span>: 
          <span className="text-zinc-400 mx-1">[{rolls.join(', ')}]</span> 
          = <span className="text-white font-bold text-lg">{total}</span>
        </span>
      );

      addChatMessage('system', rollText, 'roll');
    };

    const handleCustomRoll = (e: React.FormEvent) => {
      e.preventDefault();
      if (!customRollStr.trim()) return;

      // Parse inputs like "2d6+4", "d20-2", "1d10", "2d8"
      const cleanInput = customRollStr.toLowerCase().replace(/\s/g, '');
      const regex = /^(\d*)d(\d+)([+-]\d+)?$/;
      const match = cleanInput.match(regex);

      if (!match) {
        addChatMessage('system', <span className="text-red-400">Formato inválido! Tente: 1d20+5 ou 2d6-2</span>, 'system');
        return;
      }

      const qty = match[1] ? parseInt(match[1]) : 1;
      const sides = parseInt(match[2]);
      const modifier = match[3] ? parseInt(match[3]) : 0;

      if (qty > 50) {
        addChatMessage('system', <span className="text-red-400">Muitos dados! Limite de 50.</span>, 'system');
        return;
      }
      
      if (sides < 2) {
        addChatMessage('system', <span className="text-red-400">O dado deve ter pelo menos 2 lados.</span>, 'system');
        return;
      }

      const rolls = [];
      let sum = 0;
      for (let i = 0; i < qty; i++) {
        const val = Math.floor(Math.random() * sides) + 1;
        rolls.push(val);
        sum += val;
      }

      const total = sum + modifier;

      const rollText = (
        <span>
          Rolou <span className="text-gamer-highlight font-mono font-bold">{qty}d{sides}{modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ''}</span>: 
          <span className="text-zinc-400 mx-1">[{rolls.join(', ')}]</span> 
          {modifier !== 0 && (
            <span className={modifier > 0 ? "text-green-400" : "text-red-400"}>
              {modifier > 0 ? `+ ${modifier}` : `- ${Math.abs(modifier)}`}
            </span>
          )}
          {' = '}
          <span className="text-white font-bold text-lg">{total}</span>
        </span>
      );

      addChatMessage('system', rollText, 'roll');
      setCustomRollStr('');
    };

    const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!chatInput.trim()) return;
      addChatMessage(isGM ? 'gm' : 'player', chatInput);
      setChatInput('');
    };

    return (
      <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-0 border border-yellow-900/30 rounded-xl overflow-hidden shadow-2xl bg-zinc-900">
        {/* ... (Resto do componente de mesa mantido) ... */}
        {/* LEFT PANEL: Dice & Chat (300px - 350px fixed) */}
        <aside className="w-full lg:w-[380px] flex flex-col bg-gradient-to-b from-zinc-900 to-zinc-950 border-r border-yellow-500/30 z-10">
          
          {/* DICE SECTION */}
          <div className="p-4 border-b border-yellow-500/20 bg-zinc-900">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-yellow-500 font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                 <Dices className="w-4 h-4" /> Rolar Dados
               </h3>
               <div className="flex items-center gap-2">
                 <span className="text-[10px] text-zinc-500 uppercase font-bold">Qtd:</span>
                 <input 
                   type="number" 
                   min="1" 
                   max="20" 
                   value={diceQty}
                   onChange={(e) => setDiceQty(parseInt(e.target.value) || 1)}
                   className="w-12 bg-zinc-950 border border-zinc-700 rounded text-center text-white font-mono text-sm py-1 focus:border-gamer-highlight outline-none"
                 />
               </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[4, 6, 8, 10, 12, 20].map((side) => (
                <button 
                  key={side}
                  onClick={() => handleRoll(side)}
                  className="group relative overflow-hidden bg-zinc-800 hover:bg-gamer-highlight border border-zinc-700 hover:border-gamer-highlight rounded-md py-2 transition-all duration-200 active:scale-95"
                >
                  <span className="text-zinc-300 font-mono font-bold group-hover:text-zinc-900 relative z-10">d{side}</span>
                  <div className="absolute inset-0 bg-yellow-400/20 translate-y-full group-hover:translate-y-0 transition-transform duration-200" />
                </button>
              ))}
              <button 
                  onClick={() => handleRoll(100)}
                  className="col-span-3 group relative overflow-hidden bg-zinc-800 hover:bg-gamer-highlight border border-zinc-700 hover:border-gamer-highlight rounded-md py-2 transition-all duration-200 active:scale-95"
                >
                  <span className="text-zinc-300 font-mono font-bold group-hover:text-zinc-900 relative z-10">d100</span>
              </button>
            </div>
            
            <form onSubmit={handleCustomRoll} className="flex gap-2">
               <input 
                 type="text" 
                 value={customRollStr}
                 onChange={(e) => setCustomRollStr(e.target.value)}
                 placeholder="Ex: 2d8+4"
                 className="flex-1 bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-xs text-white font-mono focus:border-gamer-highlight outline-none placeholder-zinc-600"
               />
               <button type="submit" className="bg-zinc-800 hover:bg-gamer-highlight hover:text-zinc-900 text-zinc-400 px-3 rounded border border-zinc-700 transition-colors">
                 <Zap className="w-4 h-4" />
               </button>
            </form>
          </div>

          {/* CHAT SECTION */}
          <div className="flex-1 flex flex-col min-h-0 bg-zinc-900">
             <div className="px-4 py-2 border-b border-yellow-500/10 bg-zinc-900 shadow-sm z-10">
                <h3 className="text-yellow-500 font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <Send className="w-3 h-3" /> Chat da Sessão
                </h3>
             </div>
             
             <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-zinc-950">
                {chatHistory.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.type === 'system' || msg.type === 'roll' ? 'items-center my-2' : 'items-start'}`}>
                      {/* Sender Header (skip for system) */}
                      {msg.type !== 'system' && msg.type !== 'roll' && (
                        <div className="flex items-baseline gap-2 mb-1 ml-1">
                          <span className={`text-[10px] font-black uppercase tracking-wider ${msg.role === 'gm' ? 'text-purple-400' : msg.role === 'player' ? 'text-blue-400' : 'text-red-400'}`}>
                            {msg.sender}
                          </span>
                          <span className="text-[9px] text-zinc-600">{msg.time}</span>
                        </div>
                      )}

                      {/* Message Body */}
                      {msg.type === 'system' ? (
                         <span className="text-xs italic text-yellow-500/60 font-mono text-center w-full border-y border-yellow-500/10 py-1">{msg.text}</span>
                      ) : msg.type === 'roll' ? (
                        <div className="bg-yellow-900/10 border-l-2 border-yellow-500 w-full p-2 text-xs text-zinc-300 font-mono">
                          {msg.text}
                        </div>
                      ) : (
                         <div className={`max-w-[90%] rounded-xl rounded-tl-none px-3 py-2 text-sm leading-relaxed shadow-sm border border-zinc-800 ${msg.role === 'gm' ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-900 text-zinc-300'} ${msg.type === 'narrative_danger' ? 'text-red-400 italic border-red-900/30' : ''}`}>
                           {msg.text}
                         </div>
                      )}
                  </div>
                ))}
             </div>

             {/* Chat Input */}
             <div className="p-3 bg-zinc-900 border-t border-zinc-800">
               <form onSubmit={handleSendMessage} className="relative">
                 <input 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    type="text" 
                    placeholder="Digite sua mensagem..."
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-full pl-4 pr-10 py-2.5 text-sm text-white focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 outline-none transition-all"
                 />
                 <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-yellow-600 hover:bg-yellow-500 rounded-full flex items-center justify-center text-zinc-900 transition-colors">
                    <Send className="w-3.5 h-3.5 ml-0.5" />
                 </button>
               </form>
             </div>
          </div>
        </aside>

        {/* CENTER PANEL: Map / VTT */}
        <main className="flex-1 relative bg-[#141414] overflow-hidden group">
          <div className="absolute inset-0 opacity-30" 
               style={{ backgroundImage: 'repeating-conic-gradient(#1a1a1a 0% 25%, #222222 0% 50%)', backgroundSize: '40px 40px', backgroundPosition: 'center' }} 
          />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
          {/* Mock Tokens */}
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-20">
             <div className="w-14 h-14 rounded-full border-[3px] border-green-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] bg-zinc-800 overflow-hidden relative">
               <img src={playerChar.avatar_url} alt="Player" className="w-full h-full object-cover" />
             </div>
             <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/80 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap border border-green-900/50">
               {playerChar.name}
             </div>
          </div>
          {/* ... */}
        </main>

        {/* RIGHT PANEL: Simple Ficha in VTT */}
        <aside className="w-full lg:w-[380px] flex flex-col bg-gradient-to-b from-zinc-900 to-zinc-950 border-l border-yellow-500/30 z-10">
          <div className="p-4 bg-zinc-900 border-b border-yellow-500/20">
            <h2 className="text-xs font-bold text-yellow-500 uppercase tracking-wider mb-2">Ficha Resumida</h2>
            <div className="flex items-center gap-3 mb-3">
               <img src={playerChar.avatar_url} className="w-10 h-10 rounded-full border border-zinc-700" />
               <div>
                 <div className="text-sm font-bold text-white">{playerChar.name}</div>
                 <div className="text-xs text-zinc-500">{playerChar.class} Lvl {playerChar.level}</div>
               </div>
            </div>
            {/* ... */}
          </div>
        </aside>
      </div>
    );
  };

  const SettingsView = () => {
    // (Mantido igual ao anterior)
    const [editingEmail, setEditingEmail] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    
    return (
      <div className="max-w-3xl mx-auto animate-[fadeIn_0.3s_ease-out] pb-24">
         <div className="flex items-center gap-4 mb-8 border-b border-zinc-800 pb-6">
           <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
             <Settings className="w-8 h-8 text-white" />
           </div>
           <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Configurações da Conta</h2>
              <p className="text-sm text-zinc-400 font-mono">Gerencie suas credenciais e perfil</p>
           </div>
         </div>
         <GamerCard className="mb-6 bg-zinc-900 border-zinc-800">
           {/* ... Avatar Section ... */}
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                 <div className="w-24 h-24 rounded-full border-4 border-zinc-800 shadow-xl overflow-hidden bg-zinc-950 relative group cursor-pointer">
                    <img src={playerChar.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                       <Upload className="w-6 h-6 text-white" />
                    </div>
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-white uppercase mb-1">Avatar do Usuário</h3>
                   <p className="text-xs text-zinc-500 mb-2 max-w-[250px]">Personalize como você aparece na mesa de jogo e no chat.</p>
                 </div>
              </div>
              <GamerButton className="w-auto px-6" variant="secondary">
                 <Upload className="w-4 h-4 mr-2" /> Alterar Imagem
              </GamerButton>
           </div>
         </GamerCard>
         {/* ... Email & Password sections ... */}
      </div>
    )
  }

  // --- Views (Updated with Forms) ---

  const LoginView = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* ... Header ... */}
      <div className="mb-8 text-center relative z-20">
        <h1 className="text-4xl font-black tracking-tighter text-white mb-1 drop-shadow-lg">
          PIXEL REALMS <span className="text-gamer-highlight">HUB</span>
        </h1>
        <p className="text-zinc-300 font-mono text-sm drop-shadow-md">SYSTEM_LOGIN_V1.0</p>
      </div>

      <GamerCard className="w-full max-w-md animate-[fadeIn_0.5s_ease-out] bg-zinc-900 z-20">
        <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-gamer-primary pl-3">IDENTIFICAÇÃO</h2>
        
        <form onSubmit={handleLogin}>
          <GamerInput 
            name="email"
            label="E-mail" 
            placeholder="Digite seu e-mail..." 
            icon={<User className="w-4 h-4" />}
          />
          <GamerInput 
            name="password"
            label="Senha" 
            type="password" 
            placeholder="••••••••" 
            icon={<Lock className="w-4 h-4" />}
          />

          <GamerButton type="submit" loading={loading} className="mt-6">
            ENTRAR NO REINO
          </GamerButton>
        </form>

        <div className="mt-4 grid grid-cols-2 gap-4">
           <GamerButton variant="secondary" onClick={() => setView('role-select')}>
            CADASTRAR
           </GamerButton>
        </div>
      </GamerCard>
    </div>
  );

  const SignupFormView = () => {
    const isGM = userType === 'master';
    const accentColor = isGM ? 'border-gamer-master' : 'border-gamer-primary';
    const btnVariant = isGM ? 'master' : 'primary';

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
         <div className="w-full max-w-md mb-4">
           <button onClick={() => setView('role-select')} className="flex items-center text-white hover:text-gamer-highlight transition-colors drop-shadow-md">
             <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
           </button>
         </div>

        <GamerCard className="w-full max-w-md animate-[fadeIn_0.5s_ease-out] bg-zinc-900">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold text-white border-l-4 ${accentColor} pl-3`}>
              NOVO {isGM ? 'MESTRE' : 'JOGADOR'}
            </h2>
            {isGM ? <Crown className="text-gamer-master w-6 h-6" /> : <Sword className="text-gamer-primary w-6 h-6" />}
          </div>

          <form onSubmit={handleSignupSubmit} className="space-y-2">
            <GamerInput 
              name="name"
              label={isGM ? "Nome do Mestre" : "Nome do Jogador"}
              placeholder="Seu nome de exibição"
              icon={<User className="w-4 h-4" />}
              required
            />

            <GamerInput 
              name="email"
              label="E-mail"
              type="email"
              placeholder="contato@email.com"
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <GamerInput 
                name="password"
                label="Senha"
                type="password"
                placeholder="******"
                icon={<Lock className="w-4 h-4" />}
                required
              />
               <GamerInput 
                name="confirm"
                label="Confirmar"
                type="password"
                placeholder="******"
                icon={<Lock className="w-4 h-4" />}
                required
              />
            </div>

            <div className="mt-8">
              <GamerButton type="submit" variant={btnVariant} loading={loading}>
                FINALIZAR CADASTRO
              </GamerButton>
            </div>
          </form>
        </GamerCard>
      </div>
    );
  };

  // ... (Outras views mantidas: RecoveryView, RoleSelectView, DashboardView)
  const RecoveryView = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
       <div className="w-full max-w-md mb-4">
         <button onClick={() => setView('login')} className="flex items-center text-white hover:text-gamer-highlight transition-colors drop-shadow-md">
           <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
         </button>
       </div>
       <GamerCard className="w-full max-w-md animate-[fadeIn_0.5s_ease-out] bg-zinc-900">
        <h2 className="text-xl font-bold text-white mb-2 border-l-4 border-gamer-super pl-3">RECUPERAR ACESSO</h2>
        <p className="text-zinc-400 text-sm mb-6">Insira seu e-mail registrado para receber o link de redefinição.</p>

        <GamerInput 
          label="E-mail Registrado" 
          placeholder="exemplo@email.com" 
          type="email"
          icon={<Mail className="w-4 h-4" />}
        />

        <GamerButton variant="super" onClick={() => setView('login')}>
          ENVIAR LINK
        </GamerButton>
      </GamerCard>
    </div>
  );

  const RoleSelectView = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <div className="w-full max-w-4xl mb-4 relative z-20">
         <button onClick={() => setView('login')} className="flex items-center text-white hover:text-gamer-highlight transition-colors drop-shadow-md">
           <ChevronLeft className="w-4 h-4 mr-1" /> Cancelar
         </button>
       </div>
      
      <div className="text-center mb-12 relative z-20">
        <h2 className="text-4xl font-black text-white mb-2 drop-shadow-md">ESCOLHA SEU DESTINO</h2>
        <p className="text-zinc-300 font-mono tracking-wide drop-shadow-sm">Como você ingressará no sistema Pixel Realms?</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl items-center justify-center relative z-20">
        <BauhausCard 
          id="master-card"
          topInscription="GAMEMASTER"
          mainText="MESTRE"
          subMainText="O Criador de Mundos"
          progressBarInscription="PODER NARRATIVO"
          progress={100}
          progressValue="ILIMITADO"
          accentColor="#9333ea" 
          separatorColor="#581c87"
          backgroundColor="#18181b"
          filledButtonInscription="CRIAR CAMPANHA"
          onFilledButtonClick={() => handleSignupTypeSelect('master')}
          onOutlinedButtonClick={() => {}}
          onMoreOptionsClick={() => {}}
        />

        <BauhausCard 
          id="player-card"
          topInscription="ADVENTURER"
          mainText="JOGADOR"
          subMainText="O Herói da História"
          progressBarInscription="NÍVEL INICIAL"
          progress={1}
          progressValue="LVL 1"
          accentColor="#dc2626" 
          separatorColor="#991b1b"
          backgroundColor="#18181b"
          filledButtonInscription="CRIAR FICHA"
          onFilledButtonClick={() => handleSignupTypeSelect('player')}
          onOutlinedButtonClick={() => {}}
          onMoreOptionsClick={() => {}}
        />
      </div>
    </div>
  );

  const DashboardView = () => {
    // Mock Dashboard Data
    const campaigns = [
      { id: 1, name: 'Ruínas de Idron', status: 'Ativa', progress: 65 },
      { id: 2, name: 'Vale das Sombras', status: 'Pausada', progress: 30 },
      { id: 3, name: 'Exp. Goblins', status: 'Concluída', progress: 100 },
    ];
    // ... (Mantido o resto dos dados mockados do Dashboard)
    const recentSessions = [
      { id: 1, date: '20/11', name: 'O Retorno do Rei', campaign: 'Ruínas de Idron' },
      { id: 2, date: '15/11', name: 'Emboscada Noturna', campaign: 'Vale das Sombras' },
      { id: 3, date: '08/11', name: 'O Fim dos Goblins', campaign: 'Exp. Goblins' },
    ];

    const rankings = [
      { label: 'Top Jogador', name: 'Ana', value: 'Lvl 12' },
      { label: 'Monstros Mortos', name: 'Ricardo', value: '42' },
      { label: 'Top Sessões', name: 'Pirlim', value: '15' },
    ];
    
    // Configuração do Menu Inferior
    const navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, color: 'border-gamer-primary', textColor: 'text-gamer-primary', shadowColor: 'shadow-[0_0_15px_rgba(220,38,38,0.5)]' },
      { id: 'mesa', label: 'Mesa', icon: <Dices className="w-5 h-5" />, color: 'border-gamer-highlight', textColor: 'text-gamer-highlight', shadowColor: 'shadow-[0_0_15px_rgba(250,204,21,0.5)]' },
      { id: 'ficha', label: 'Ficha', icon: <Scroll className="w-5 h-5" />, color: 'border-gamer-super', textColor: 'text-gamer-super', shadowColor: 'shadow-[0_0_15px_rgba(34,211,238,0.5)]' },
      { id: 'config', label: 'Opções', icon: <Settings className="w-5 h-5" />, color: 'border-zinc-400', textColor: 'text-white', shadowColor: 'shadow-[0_0_15px_rgba(255,255,255,0.15)]' },
    ];

    const DashboardHome = () => (
      <div className="max-w-7xl mx-auto space-y-6 animate-[fadeIn_0.3s_ease-out] pb-24">
        {/* Welcome */}
        <div className="flex items-center justify-between">
           <div>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase">Bem-vindo, {playerChar.name}!</h2>
              <p className="text-zinc-400 font-mono text-sm">Resumo da sua jornada no Pixel Realms.</p>
           </div>
           <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-zinc-400 uppercase">Sistema Online</span>
           </div>
        </div>

        {/* 3-Col Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GamerCard className="bg-zinc-900 border-zinc-800 flex flex-col h-full">
             <div className="flex items-center gap-2 mb-4 text-gamer-primary">
                <Scroll className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Campanhas</h3>
             </div>
             <ul className="space-y-3 flex-1">
                {campaigns.map(c => (
                  <li key={c.id} className="group cursor-pointer">
                     <div className="flex justify-between text-xs font-bold text-white mb-1">
                        <span className="group-hover:text-gamer-primary transition-colors">{c.name}</span>
                        <span className={c.status === 'Ativa' ? 'text-green-500' : 'text-zinc-500'}>{c.status}</span>
                     </div>
                     <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                        <div className="h-full bg-zinc-700 group-hover:bg-gamer-primary transition-colors" style={{ width: `${c.progress}%` }} />
                     </div>
                  </li>
                ))}
             </ul>
             <button className="mt-4 w-full py-2 text-xs font-bold text-zinc-500 hover:text-white hover:bg-zinc-800 rounded border border-transparent hover:border-zinc-700 transition-all uppercase">
                Ver Todas
             </button>
          </GamerCard>

          <GamerCard className="bg-zinc-900 border-zinc-800 flex flex-col h-full">
             <div className="flex items-center gap-2 mb-4 text-gamer-highlight">
                <History className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Sessões Recentes</h3>
             </div>
             <ul className="space-y-0 flex-1 relative">
                <div className="absolute left-[2.5rem] top-2 bottom-2 w-px bg-zinc-800" />
                {recentSessions.map(s => (
                  <li key={s.id} className="relative pl-14 py-2 group cursor-pointer hover:bg-zinc-800/50 -mr-4 rounded-l-lg transition-colors">
                     <div className="absolute left-2 top-3 text-xs font-mono text-zinc-500 w-8 text-right">{s.date}</div>
                     <div className="absolute left-[2.3rem] top-3.5 w-2 h-2 rounded-full bg-zinc-950 border-2 border-zinc-600 group-hover:border-gamer-highlight transition-colors z-10" />
                     <h4 className="text-xs font-bold text-white group-hover:text-gamer-highlight transition-colors">{s.name}</h4>
                     <p className="text-[10px] text-zinc-500">{s.campaign}</p>
                  </li>
                ))}
             </ul>
          </GamerCard>

          <GamerCard className="bg-zinc-900 border-zinc-800 flex flex-col h-full">
             <div className="flex items-center gap-2 mb-4 text-gamer-super">
                <Trophy className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Ranking Global</h3>
             </div>
             <div className="space-y-4 flex-1">
                {rankings.map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-zinc-950 border border-zinc-800 rounded-lg">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-zinc-900 flex items-center justify-center font-black text-zinc-600 italic">#{i+1}</div>
                        <div>
                           <div className="text-[10px] text-zinc-500 uppercase">{r.label}</div>
                           <div className="text-xs font-bold text-white">{r.name}</div>
                        </div>
                     </div>
                     <div className="text-xs font-mono font-bold text-gamer-super">{r.value}</div>
                  </div>
                ))}
             </div>
          </GamerCard>
        </div>

        {/* Stats Graph */}
        <GamerCard className="bg-zinc-900 border-zinc-800 relative overflow-hidden">
           <div className="absolute top-4 right-4 flex gap-2">
              <div className="flex items-center gap-1 text-[10px] text-zinc-400 uppercase"><div className="w-2 h-2 bg-gamer-super rounded-full" /> Mortos</div>
              <div className="flex items-center gap-1 text-[10px] text-zinc-400 uppercase"><div className="w-2 h-2 bg-zinc-600 rounded-full" /> Feridos</div>
           </div>
           <div className="flex items-center gap-2 mb-6 text-white">
              <BarChart3 className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Estatísticas de Combate (Global)</h3>
           </div>
           <div className="h-48 w-full relative">
               <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
                  <line x1="0" y1="50" x2="1000" y2="50" stroke="#27272a" strokeWidth="1" />
                  <line x1="0" y1="100" x2="1000" y2="100" stroke="#27272a" strokeWidth="1" />
                  <line x1="0" y1="150" x2="1000" y2="150" stroke="#27272a" strokeWidth="1" />
                  <path d="M0,150 C200,100 400,180 600,80 S800,20 1000,120" fill="none" stroke="#22d3ee" strokeWidth="3" />
                  <path d="M0,180 C200,160 400,140 600,150 S800,160 1000,140" fill="none" stroke="#52525b" strokeWidth="3" strokeDasharray="6 6" />
               </svg>
           </div>
        </GamerCard>
        
        {/* Footer Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 flex gap-1">
              <button onClick={() => {}} className="flex-1 py-4 rounded-lg hover:bg-zinc-800 flex flex-col items-center gap-2 group transition-colors">
                 <PlusCircle className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors" />
                 <span className="text-xs font-bold text-zinc-500 group-hover:text-white uppercase">Criar Campanha</span>
              </button>
              <div className="w-px bg-zinc-800 my-2" />
              <button onClick={() => {}} className="flex-1 py-4 rounded-lg hover:bg-zinc-800 flex flex-col items-center gap-2 group transition-colors">
                 <Skull className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors" />
                 <span className="text-xs font-bold text-zinc-500 group-hover:text-white uppercase">Bestiário</span>
              </button>
           </div>
           <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 flex gap-1">
              <button onClick={() => setActiveTab('ficha')} className="flex-1 py-4 rounded-lg hover:bg-zinc-800 flex flex-col items-center gap-2 group transition-colors">
                 <Scroll className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors" />
                 <span className="text-xs font-bold text-zinc-500 group-hover:text-white uppercase">Minha Ficha</span>
              </button>
              <div className="w-px bg-zinc-800 my-2" />
              <button onClick={() => {}} className="flex-1 py-4 rounded-lg hover:bg-zinc-800 flex flex-col items-center gap-2 group transition-colors">
                 <BookOpen className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors" />
                 <span className="text-xs font-bold text-zinc-500 group-hover:text-white uppercase">Regras</span>
              </button>
           </div>
        </div>
      </div>
    );

    return (
      <div className="min-h-screen pb-32">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-zinc-950 border-b border-zinc-800 shadow-lg shadow-black/50 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4 min-w-[150px]">
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-900 border shadow-lg ${userType === 'master' ? 'border-gamer-master shadow-gamer-master/20' : 'border-gamer-primary shadow-gamer-primary/20'}`}>
                  {userType === 'master' ? <Crown className="w-6 h-6 text-gamer-master" /> : <Sword className="w-6 h-6 text-gamer-primary" />}
               </div>
               <div className="hidden sm:block">
                 <h1 className="font-black text-white leading-none tracking-tighter text-lg">PIXEL REALMS</h1>
                 <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{userType === 'master' ? 'Mestre' : 'Jogador'}</span>
               </div>
            </div>

            <div className="flex items-center justify-end gap-3 min-w-[150px]">
              <button 
                onClick={handleLogout}
                className="w-10 h-10 rounded-full hover:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 lg:p-6 max-w-[1600px] mx-auto pt-4 sm:pt-8">
           {activeTab === 'dashboard' && <DashboardHome />}
           {activeTab === 'mesa' && <GameTableView userType={userType} />}
           {activeTab === 'ficha' && <CharacterSheet character={playerChar} isGM={userType === 'master'} />}
           {activeTab === 'master-screen' && <MasterScreen />}
           {activeTab === 'config' && <SettingsView />}
        </main>

        {/* Bottom Nav */}
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 sm:gap-4 bg-zinc-900 border border-zinc-800 px-4 sm:px-6 py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          {userType === 'master' && (
            <div className="relative group">
                <button
                onClick={() => setActiveTab('master-screen')}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${activeTab === 'master-screen' ? 'bg-gamer-master text-white border-gamer-master shadow-[0_0_20px_rgba(147,51,234,0.5)]' : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-gamer-master hover:text-gamer-master'}`}
              >
                <Crown className="w-5 h-5" />
              </button>
            </div>
          )}
          
          {userType === 'master' && <div className="h-8 w-px bg-zinc-700 mx-1" />}

          {navItems.map((item) => (
              <div key={item.id} className="relative group">
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${activeTab === item.id ? `bg-zinc-800 ${item.textColor} ${item.color} ${item.shadowColor}` : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-white'}`}
              >
                {item.icon}
              </button>
            </div>
          ))}
        </nav>
      </div>
    );
  };

  return (
    <div className="font-sans text-white antialiased selection:bg-gamer-primary selection:text-white min-h-screen relative">
      <PixelGrid 
        pixelColor={getPixelThemeColor()} 
        bgColor="#09090b"
        className="fixed inset-0"
      />
      
      <div className="relative z-10">
        {view === 'login' && <LoginView />}
        {view === 'recovery' && <RecoveryView />}
        {view === 'role-select' && <RoleSelectView />}
        {(view === 'signup-gm' || view === 'signup-player') && <SignupFormView />}
        {view === 'dashboard' && <DashboardView />}
      </div>
    </div>
  );
};

export default App;
