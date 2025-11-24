
import React, { useState } from 'react';
import { 
  Sword, 
  Scroll, 
  Users, 
  Dices, 
  Skull, 
  Save, 
  Plus, 
  Search, 
  MoreHorizontal,
  Edit3,
  Settings,
  Box,
  Image,
  Castle,
  Trees,
  Home
} from 'lucide-react';
import { GamerCard } from './UI';

interface NpcCard {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'active' | 'dead' | 'hidden';
  hp?: number;
}

interface Scenery {
  id: string;
  name: string;
  type: 'interior' | 'exterior' | 'dungeon';
  icon: React.ReactNode;
  gradient: string;
}

export const MasterScreen: React.FC = () => {
  const [noteText, setNoteText] = useState('');
  const [activeImageTab, setActiveImageTab] = useState<'scenery' | 'tokens'>('scenery');
  
  // Mock NPCs for the top gallery with Pixel Art Avatars
  const npcs: NpcCard[] = [
    { id: '1', name: 'Lord Varian', role: 'Rei', avatar: 'https://i.imgur.com/R3k9nQJ.png', status: 'active', hp: 100 },
    { id: '2', name: 'Goblin Chefe', role: 'Inimigo', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GoblinKing', status: 'active', hp: 45 },
    { id: '3', name: 'Pirlim', role: 'PC', avatar: 'https://i.imgur.com/L5mnOPQ.png', status: 'active', hp: 32 },
    { id: '4', name: 'Mercador', role: 'NPC', avatar: 'https://i.imgur.com/G7h8j9k.png', status: 'active', hp: 10 },
    { id: '5', name: 'Espião', role: 'Oculto', avatar: 'https://i.imgur.com/yP4t5uL.png', status: 'hidden' },
  ];

  const tools = [
    { id: 'generator', label: 'Gerador de PdM', icon: Users, color: 'text-purple-400', desc: 'Criar NPCs instantâneos' },
    { id: 'combat', label: 'Rastreador de Combate', icon: Sword, color: 'text-red-400', desc: 'Iniciativa e HP' },
    { id: 'inventory', label: 'Tesouro Global', icon: Box, color: 'text-yellow-400', desc: 'Distribuir itens' },
    { id: 'images', label: 'Banco de Imagens', icon: Image, color: 'text-pink-400', desc: 'Cenários e Mapas' },
    { id: 'monsters', label: 'Bestiário', icon: Skull, color: 'text-green-400', desc: 'Fichas de monstros' },
    { id: 'rolls', label: 'Rolagem Rápida', icon: Dices, color: 'text-white', desc: 'Dados secretos' },
  ];

  const sceneries: Scenery[] = [
    { id: 'tavern', name: 'Taverna do Dragão', type: 'interior', icon: <Home className="w-8 h-8 text-orange-300" />, gradient: 'from-orange-900 to-orange-950' },
    { id: 'forest', name: 'Floresta Sombria', type: 'exterior', icon: <Trees className="w-8 h-8 text-green-300" />, gradient: 'from-green-900 to-green-950' },
    { id: 'dungeon', name: 'Masmorra Antiga', type: 'dungeon', icon: <Skull className="w-8 h-8 text-zinc-300" />, gradient: 'from-zinc-800 to-black' },
    { id: 'castle', name: 'Sala do Trono', type: 'interior', icon: <Castle className="w-8 h-8 text-purple-300" />, gradient: 'from-purple-900 to-purple-950' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-24 animate-[fadeIn_0.3s_ease-out]">
      
      {/* --- TOP: NPC GALLERY --- */}
      <section>
        <div className="flex items-center justify-between mb-3 px-2">
          <h2 className="text-xs font-bold text-gamer-master uppercase tracking-widest flex items-center gap-2">
            <Users className="w-4 h-4" /> Personagens em Cena
          </h2>
          <button className="text-xs text-zinc-500 hover:text-gamer-master transition-colors flex items-center gap-1">
            <Plus className="w-3 h-3" /> Adicionar
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 px-1 custom-scrollbar">
          {npcs.map((npc) => (
            <div key={npc.id} className="group relative flex-shrink-0 cursor-pointer">
              <div className={`w-16 h-16 rounded-full border-2 p-0.5 bg-zinc-900 transition-transform group-hover:scale-105 ${npc.role === 'Inimigo' ? 'border-red-500' : 'border-purple-500'}`}>
                <div className="w-full h-full rounded-full overflow-hidden relative">
                   <img src={npc.avatar} alt={npc.name} className="w-full h-full object-cover" />
                   {npc.status === 'hidden' && (
                     <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                       <Search className="w-6 h-6 text-zinc-500" />
                     </div>
                   )}
                </div>
              </div>
              <div className="text-center mt-2">
                <div className="text-[10px] font-bold text-white truncate w-20 mx-auto">{npc.name}</div>
                <div className="text-[9px] text-zinc-500 uppercase">{npc.role}</div>
              </div>
              
              {/* Hover Quick Actions */}
              <div className="absolute -top-2 -right-2 hidden group-hover:flex flex-col gap-1">
                <button className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center text-white hover:bg-gamer-master hover:border-gamer-master" title="Editar">
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
          
          {/* Add Button */}
          <button className="w-16 h-16 rounded-full border-2 border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 hover:text-gamer-master hover:border-gamer-master transition-colors">
             <Plus className="w-6 h-6" />
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- LEFT: TOOLS GRID --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tool Cards */}
          <div>
            <h2 className="text-xs font-bold text-gamer-master uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
              <Settings className="w-4 h-4" /> Ferramentas do Mestre
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {tools.map((tool) => (
                <GamerCard 
                  key={tool.id} 
                  className="group cursor-pointer bg-zinc-900 hover:bg-zinc-800 border-zinc-800 hover:border-gamer-master/50 transition-all"
                >
                  <div className="flex flex-col items-start h-full justify-between gap-4">
                    <div className={`p-3 rounded-lg bg-zinc-950 border border-zinc-800 group-hover:border-gamer-master/30 ${tool.color}`}>
                        <tool.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-gamer-master transition-colors">{tool.label}</h3>
                      <p className="text-xs text-zinc-500 mt-1">{tool.desc}</p>
                    </div>
                  </div>
                </GamerCard>
              ))}
            </div>
          </div>

          {/* Image Bank Section */}
          <div>
            <div className="flex items-center justify-between mb-3 px-2">
               <h2 className="text-xs font-bold text-gamer-master uppercase tracking-widest flex items-center gap-2">
                 <Image className="w-4 h-4" /> Banco de Imagens
               </h2>
               <div className="flex bg-zinc-900 rounded p-1 border border-zinc-800">
                  <button 
                    onClick={() => setActiveImageTab('scenery')}
                    className={`px-3 py-1 text-[10px] font-bold uppercase rounded transition-colors ${activeImageTab === 'scenery' ? 'bg-gamer-master text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Cenários
                  </button>
                   <button 
                    onClick={() => setActiveImageTab('tokens')}
                    className={`px-3 py-1 text-[10px] font-bold uppercase rounded transition-colors ${activeImageTab === 'tokens' ? 'bg-gamer-master text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Tokens
                  </button>
               </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {activeImageTab === 'scenery' && sceneries.map((scene) => (
                <div key={scene.id} className="group cursor-pointer relative aspect-video rounded-lg overflow-hidden border border-zinc-800 hover:border-gamer-master transition-all shadow-lg">
                   <div className={`absolute inset-0 bg-gradient-to-br ${scene.gradient} opacity-80 group-hover:opacity-100 transition-opacity`} />
                   <div className="absolute inset-0 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
                      {scene.icon}
                   </div>
                   <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm">
                      <div className="text-[10px] font-bold text-white">{scene.name}</div>
                      <div className="text-[9px] text-zinc-400 uppercase">{scene.type}</div>
                   </div>
                   <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-gamer-master text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">Aplicar</div>
                   </div>
                </div>
              ))}
              
              {activeImageTab === 'scenery' && (
                 <div className="cursor-pointer aspect-video rounded-lg border-2 border-dashed border-zinc-800 hover:border-gamer-master flex flex-col items-center justify-center text-zinc-600 hover:text-gamer-master transition-colors bg-zinc-900/50">
                    <Plus className="w-6 h-6 mb-2" />
                    <span className="text-[10px] font-bold uppercase">Upload</span>
                 </div>
              )}
            </div>
          </div>

          {/* Quick Dice Roller (Universal) */}
          <div className="mt-2">
             <GamerCard className="bg-zinc-900 border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-sm font-bold text-white flex items-center gap-2">
                     <Dices className="w-4 h-4 text-gamer-master" /> Rolagem Secreta
                   </h3>
                   <span className="text-xs text-zinc-500">Resultados visíveis apenas para você</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                   {[4, 6, 8, 10, 12, 20, 100].map(d => (
                     <button key={d} className="px-4 py-2 bg-zinc-950 border border-zinc-800 hover:border-gamer-master rounded text-xs font-bold text-zinc-400 hover:text-white transition-colors">
                       d{d}
                     </button>
                   ))}
                </div>
             </GamerCard>
          </div>
        </div>

        {/* --- RIGHT: SECRET NOTES --- */}
        <div className="lg:col-span-1 h-full flex flex-col">
           <div className="flex items-center justify-between mb-3 px-2">
            <h2 className="text-xs font-bold text-gamer-master uppercase tracking-widest flex items-center gap-2">
              <Scroll className="w-4 h-4" /> Anotações Secretas
            </h2>
            <div className="flex gap-2">
               <button className="p-1 hover:text-white text-zinc-500"><Save className="w-4 h-4" /></button>
               <button className="p-1 hover:text-white text-zinc-500"><MoreHorizontal className="w-4 h-4" /></button>
            </div>
          </div>
          
          <GamerCard className="flex-1 bg-zinc-950 border-zinc-800 p-0 overflow-hidden flex flex-col min-h-[400px]">
             <div className="flex border-b border-zinc-800">
                <button className="flex-1 py-2 text-xs font-bold bg-zinc-900 text-gamer-master border-b-2 border-gamer-master">Geral</button>
                <button className="flex-1 py-2 text-xs font-bold text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300">Sessão 12</button>
                <button className="flex-1 py-2 text-xs font-bold text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300">NPCs</button>
             </div>
             <textarea 
               className="flex-1 w-full bg-zinc-950 p-4 text-sm text-zinc-300 font-mono focus:outline-none resize-none custom-scrollbar"
               placeholder="Escreva suas notas secretas aqui..."
               value={noteText}
               onChange={(e) => setNoteText(e.target.value)}
             />
             <div className="p-2 bg-zinc-900 border-t border-zinc-800 text-[10px] text-zinc-500 flex justify-between">
                <span>Ultima edição: Agora mesmo</span>
                <span>{noteText.length} caracteres</span>
             </div>
          </GamerCard>
        </div>

      </div>
    </div>
  );
};
