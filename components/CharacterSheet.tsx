
import React, { useState } from 'react';
import { 
  Shield, 
  Zap, 
  Heart, 
  Skull, 
  Scroll, 
  Backpack, 
  Sword,
  Edit2,
  Save,
  Activity,
  Wind,
  Ghost,
  Mountain,
  Dices,
  Unlock,
  Search,
  Book,
  TrendingUp,
  Info,
  AlertCircle,
  Feather,
  Plus
} from 'lucide-react';
import { GamerCard } from './UI';

// --- Types ---
interface CharacterAttributes {
  strength: number;
  strength_percentile?: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

interface SavingThrows {
  poison: number;
  rod: number;
  petrification: number;
  breath: number;
  spell: number;
}

interface ThiefSkill {
  skill: string;
  value: number;
}

interface Ammo {
  name: string;
  quantity: number;
  damage: string;
}

interface Equipment {
  item_name: string;
  slot: string;
  quantity: number;
  is_equipped: boolean;
  weight?: number;
  type?: 'weapon' | 'armor' | 'potion' | 'magic' | 'common';
  damage?: string;
  speed?: number;
  size?: string;
  ac_bonus?: number;
}

interface Note {
  date: string;
  text: string;
  type: string;
}

export interface Character {
  id: string;
  name: string;
  class: string;
  subclass?: string;
  race: string;
  level: number;
  xp: number;
  hp_current: number;
  hp_max: number;
  ac: number;
  thac0: number;
  movement: number;
  attributes: CharacterAttributes;
  saving_throws: SavingThrows;
  thief_skills?: ThiefSkill[];
  equipment: Equipment[];
  avatar_url: string;
  alignment?: string;
  deity?: string;
  notes?: Note[];
  languages?: string[];
  weapon_skills?: { name: string, level: string, bonus: string, note: string }[];
  general_skills?: { name: string, stat: string, value: number, note: string }[];
  ac_breakdown?: { source: string, value: number }[];
  ammo?: Ammo[];
  money?: { pp: number, gp: number, ep: number, sp: number, cp: number };
  encumbrance?: { current: number, max: number };
  spells?: {
    slots: { [level: number]: { base: number, extra: number, used: number } };
    memorized: { name: string, level: number, school: string, checked: boolean }[];
  };
}

interface CharacterSheetProps {
  character: Character;
  isGM?: boolean;
}

// --- Subcomponents ---

const StatGraph = () => (
  <div className="w-full h-48 bg-[#0d1216] rounded-xl border border-zinc-800 p-4 relative overflow-hidden">
    <div className="absolute top-4 left-4">
      <h3 className="text-gamer-super font-mono font-bold text-sm">Mortos vs Feridos</h3>
      <p className="text-[10px] text-zinc-500">Estatísticas das últimas sessões</p>
    </div>
    
    {/* SVG Graph */}
    <svg className="w-full h-full absolute bottom-0 left-0" viewBox="0 0 300 100" preserveAspectRatio="none">
      {/* Grid lines */}
      <line x1="0" y1="20" x2="300" y2="20" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="2 2" />
      <line x1="0" y1="50" x2="300" y2="50" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="2 2" />
      <line x1="0" y1="80" x2="300" y2="80" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="2 2" />

      {/* Deaths Line (Solid Cyan) */}
      <path 
        d="M0,80 C50,70 100,90 150,40 C200,10 250,30 300,60" 
        fill="none" 
        stroke="#22d3ee" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      {/* Points */}
      <circle cx="0" cy="80" r="3" fill="#22d3ee" />
      <circle cx="150" cy="40" r="3" fill="#22d3ee" />
      <circle cx="300" cy="60" r="3" fill="#22d3ee" />

      {/* Injuries Line (Dotted Gray) */}
      <path 
        d="M0,90 C50,85 100,80 150,75 C200,70 250,85 300,80" 
        fill="none" 
        stroke="#52525b" 
        strokeWidth="2" 
        strokeDasharray="4 4"
        strokeLinecap="round"
      />
      <circle cx="0" cy="90" r="2" fill="#52525b" />
      <circle cx="150" cy="75" r="2" fill="#52525b" />
      <circle cx="300" cy="80" r="2" fill="#52525b" />
    </svg>

    {/* X Axis Labels */}
    <div className="absolute bottom-2 w-full flex justify-between px-4 text-[8px] text-zinc-500 font-mono">
      <span>Sessão 1</span>
      <span>Sessão 5</span>
      <span>Atual</span>
    </div>
  </div>
);

const SolidTable = ({ headers, children }: { headers: string[], children?: React.ReactNode }) => (
  <div className="w-full overflow-hidden rounded-lg border border-zinc-800">
    <table className="w-full text-left text-xs">
      <thead className="bg-zinc-950 text-zinc-500">
        <tr>
          {headers.map((h, i) => (
            <th key={i} className="px-3 py-2 font-bold uppercase">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-zinc-900 divide-y divide-zinc-800 font-mono">
        {children}
      </tbody>
    </table>
  </div>
);

const AttributeBlock = ({ label, value, subValue, derivates }: { label: string, value: number, subValue?: number, derivates: string[] }) => {
  // Calculate mod color for visual feedback
  // AD&D modifiers usually start changing around <8 or >14. Simplified logic for display.
  const modVal = Math.floor((value - 10) / 2); 
  const modColor = modVal > 0 ? 'text-green-500' : (modVal < 0 ? 'text-red-500' : 'text-zinc-500');

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 flex flex-col relative group hover:border-gamer-super transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-black text-zinc-400 uppercase tracking-tighter group-hover:text-white transition-colors">{label}</h3>
        <div className="flex items-center gap-2">
           <div className="text-2xl font-bold text-gamer-super leading-none">
             {value}
             {subValue ? <span className="text-xs align-top ml-0.5">/{subValue}</span> : ''}
           </div>
           <span className={`text-xs font-bold ${modColor}`}>{modVal > 0 ? `+${modVal}` : modVal}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-y-1 mt-2 border-t border-zinc-800 pt-2">
        {derivates.map((d, i) => {
          const [k, v] = d.split(':');
          return (
            <div key={i} className="flex justify-between items-center text-[9px] uppercase font-mono">
              <span className="text-zinc-500">{k}</span>
              <span className="text-zinc-300 font-bold">{v}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, isGM = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'attributes' | 'skills' | 'battle' | 'inventory' | 'magic'>('info');

  const TabButton = ({ id, label, icon: Icon }: { id: any, label: string, icon: any }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center justify-center gap-2 px-4 py-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all
        ${activeTab === id 
          ? 'bg-zinc-900 text-gamer-super border-b-2 border-gamer-super' 
          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}
    >
      <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-24 animate-[fadeIn_0.3s_ease-out]">
      
      {/* --- HEADER & VITAL STATS --- */}
      <GamerCard className="bg-zinc-900" noPadding>
        <div className="p-6 pb-0 flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-xl border-2 border-zinc-700 shadow-lg overflow-hidden bg-zinc-950">
              <img src={character.avatar_url} alt={character.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-zinc-900 border border-gamer-super text-gamer-super text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
              Nível {character.level}
            </div>
          </div>

          <div className="flex-1 w-full text-center md:text-left">
             <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-1">{character.name}</h1>
             <div className="flex items-center gap-3 text-zinc-400 font-mono text-xs uppercase justify-center md:justify-start mb-3">
                <span>{character.race}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-600" />
                <span>{character.class}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-600" />
                <span className="text-gamer-super">{character.alignment || 'Neutro'}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-600" />
                <span>{character.deity}</span>
             </div>
             
             <div className="w-full max-w-md mx-auto md:mx-0">
                <div className="flex justify-between text-[9px] font-bold text-zinc-500 mb-1">
                   <span>XP: {character.xp}</span>
                   <span>PRÓX: 60000</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                   <div className="h-full bg-gamer-super w-[75%]" />
                </div>
             </div>
          </div>
        </div>

        {/* Combat Strip */}
        <div className="mt-6 bg-zinc-950 border-t border-zinc-800 p-4 grid grid-cols-3 gap-4 md:gap-8">
           {/* HP */}
           <div className="flex flex-col items-center justify-center">
              <div className="flex items-end gap-2 mb-1">
                 <span className="text-2xl font-black text-white leading-none">{character.hp_current}</span>
                 <span className="text-xs font-bold text-zinc-500 mb-1">/{character.hp_max}</span>
              </div>
              <div className="w-full h-3 bg-zinc-900 rounded-full border border-zinc-800 overflow-hidden relative">
                 <div 
                    className="h-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${(character.hp_current/character.hp_max)*100}%`,
                      background: character.hp_current < character.hp_max * 0.3 ? '#ef4444' : (character.hp_current < character.hp_max * 0.6 ? '#eab308' : '#22c55e')
                    }} 
                 />
              </div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase mt-1">Pontos de Vida</span>
           </div>

           {/* AC */}
           <div className="flex flex-col items-center justify-center border-x border-zinc-800/50">
              <div className="relative w-12 h-12 flex items-center justify-center">
                 <Shield className="w-full h-full text-zinc-800 absolute inset-0" />
                 <span className="relative z-10 text-xl font-black text-gamer-super">{character.ac}</span>
              </div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase mt-1">CA Final</span>
           </div>

           {/* THAC0 */}
           <div className="flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full border-2 border-zinc-800 flex items-center justify-center bg-zinc-900">
                 <span className="text-lg font-black text-white">{character.thac0}</span>
              </div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase mt-1">THAC0</span>
           </div>
        </div>
      </GamerCard>

      {/* --- TABS --- */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="flex border-b border-zinc-800 bg-zinc-950">
           <TabButton id="info" label="Info" icon={Info} />
           <TabButton id="attributes" label="Atributos" icon={Zap} />
           <TabButton id="skills" label="Perícias" icon={Feather} />
           <TabButton id="battle" label="Batalha" icon={Sword} />
           <TabButton id="inventory" label="Inventário" icon={Backpack} />
           <TabButton id="magic" label="Magias" icon={Book} />
        </div>

        <div className="p-6 min-h-[400px] bg-zinc-900">
           
           {/* TAB: INFO */}
           {activeTab === 'info' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-[fadeIn_0.2s_ease-out]">
                <div className="space-y-6">
                   <StatGraph />
                   
                   {/* Summary Stats */}
                   <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
                      <h3 className="text-xs font-bold text-zinc-500 uppercase mb-3">Resumo de Atributos</h3>
                      <div className="grid grid-cols-6 gap-1 text-center">
                        {['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'].map((stat, i) => (
                          <div key={i} className="bg-zinc-900 p-1 rounded border border-zinc-800">
                             <div className="text-[9px] text-zinc-500">{stat}</div>
                             <div className="text-xs font-bold text-white">{Object.values(character.attributes)[i]}</div>
                          </div>
                        ))}
                      </div>
                   </div>

                   {/* Status Tags */}
                   <div className="flex flex-wrap gap-2">
                     <span className="px-3 py-1 rounded bg-green-900/20 text-green-500 border border-green-900 text-xs font-bold uppercase">Vivo</span>
                     <span className="px-3 py-1 rounded bg-zinc-900 text-zinc-500 border border-zinc-800 text-xs font-bold uppercase border-dashed">Adicionar Status</span>
                   </div>
                </div>

                <div className="h-full flex flex-col bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
                   <div className="p-3 border-b border-zinc-800 flex justify-between items-center">
                     <h3 className="text-xs font-bold text-zinc-400 uppercase">Diário de Campanha</h3>
                     <button className="text-gamer-super hover:text-white"><Plus className="w-4 h-4" /></button>
                   </div>
                   <div className="flex-1 overflow-y-auto p-0">
                     <table className="w-full text-left text-xs">
                       <thead className="bg-zinc-900 text-zinc-500 sticky top-0">
                         <tr>
                           <th className="px-4 py-2">Data</th>
                           <th className="px-4 py-2">Nota</th>
                           <th className="px-4 py-2">Tipo</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-zinc-800 font-mono">
                         {character.notes?.map((note, i) => (
                           <tr key={i} className="hover:bg-zinc-900">
                             <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">{note.date}</td>
                             <td className="px-4 py-3 text-zinc-300">{note.text}</td>
                             <td className="px-4 py-3 text-zinc-600">{note.type}</td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                </div>
             </div>
           )}

           {/* TAB: ATTRIBUTES */}
           {activeTab === 'attributes' && (
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 animate-[fadeIn_0.2s_ease-out]">
                  <AttributeBlock label="FOR" value={character.attributes.strength} subValue={character.attributes.strength_percentile} derivates={['Acerto:+1', 'Dano:+2', 'Carga:50kg', 'Portas:9']} />
                  <AttributeBlock label="DES" value={character.attributes.dexterity} derivates={['Reação:+2', 'Atq Dist:+2', 'Defesa:-3']} />
                  <AttributeBlock label="CON" value={character.attributes.constitution} derivates={['PV:+1', 'Choque:90%', 'Ressur:94%']} />
                  <AttributeBlock label="INT" value={character.attributes.intelligence} derivates={['Línguas:3', 'Círculo:N/A', 'Imune:N/A']} />
                  <AttributeBlock label="SAB" value={character.attributes.wisdom} derivates={['Def Mág:0', 'Bônus Mag:0', 'Falha:0%']} />
                  <AttributeBlock label="CAR" value={character.attributes.charisma} derivates={['Aliados:4', 'Lealdade:0', 'Reação:0']} />
              </div>
           )}

           {/* TAB: SKILLS */}
           {activeTab === 'skills' && (
             <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
               {/* Languages */}
               <div>
                 <h3 className="text-xs font-bold text-zinc-500 uppercase mb-2">Idiomas</h3>
                 <div className="flex flex-wrap gap-2">
                   {character.languages?.map(lang => (
                     <span key={lang} className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-zinc-300">{lang}</span>
                   ))}
                   <button className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 border-dashed rounded text-xs text-zinc-500 hover:text-gamer-super hover:border-gamer-super transition-colors">+ Adicionar</button>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Weapon Skills */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                       <h3 className="text-xs font-bold text-zinc-500 uppercase">Perícias com Armas</h3>
                       <button className="text-xs text-gamer-super hover:underline">+ Adicionar</button>
                    </div>
                    <SolidTable headers={['Arma', 'Nível', 'Bônus', 'Obs']}>
                       {character.weapon_skills?.map((ws, i) => (
                         <tr key={i} className="hover:bg-zinc-800">
                           <td className="px-3 py-2 text-white font-bold">{ws.name}</td>
                           <td className="px-3 py-2 text-zinc-400">{ws.level}</td>
                           <td className="px-3 py-2 text-green-400 font-bold">{ws.bonus}</td>
                           <td className="px-3 py-2 text-zinc-500 text-[10px]">{ws.note}</td>
                         </tr>
                       ))}
                    </SolidTable>
                  </div>

                  {/* General Skills */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                       <h3 className="text-xs font-bold text-zinc-500 uppercase">Perícias Gerais</h3>
                       <button className="text-xs text-gamer-super hover:underline">+ Adicionar</button>
                    </div>
                    <SolidTable headers={['Perícia', 'Hab', 'Nível', 'Nota']}>
                       {character.general_skills?.map((gs, i) => (
                         <tr key={i} className="hover:bg-zinc-800">
                           <td className="px-3 py-2 text-white font-bold">{gs.name}</td>
                           <td className="px-3 py-2 text-zinc-400">{gs.stat}</td>
                           <td className="px-3 py-2 text-white font-bold">{gs.value}</td>
                           <td className="px-3 py-2 text-zinc-500 text-[10px]">{gs.note}</td>
                         </tr>
                       ))}
                    </SolidTable>
                  </div>
               </div>
             </div>
           )}

           {/* TAB: BATTLE */}
           {activeTab === 'battle' && (
             <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {/* AC Breakdown */}
                   <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
                      <h3 className="text-xs font-bold text-zinc-500 uppercase mb-3 flex items-center gap-2"><Shield className="w-3 h-3"/> Detalhamento de CA</h3>
                      <div className="space-y-1">
                        {character.ac_breakdown?.map((item, i) => (
                          <div key={i} className="flex justify-between text-xs font-mono">
                            <span className="text-zinc-400">{item.source}</span>
                            <span className={item.value < 0 ? 'text-green-400' : 'text-red-400'}>{item.value > 0 ? `+${item.value}` : item.value}</span>
                          </div>
                        ))}
                        <div className="border-t border-zinc-800 pt-2 mt-2 flex justify-between font-bold text-sm">
                           <span className="text-white">TOTAL</span>
                           <span className="text-gamer-super">{character.ac}</span>
                        </div>
                      </div>
                   </div>
                   
                   {/* THAC0 & Init */}
                   <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                         <span className="text-xs font-bold text-zinc-500 uppercase">THAC0 Base</span>
                         <span className="text-lg font-black text-white">15</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-xs font-bold text-zinc-500 uppercase">Iniciativa</span>
                         <div className="flex items-center gap-2">
                            <button className="p-1 bg-zinc-900 hover:bg-gamer-super hover:text-zinc-900 rounded transition-colors"><Dices className="w-3 h-3" /></button>
                            <span className="text-lg font-black text-white">1d10-1</span>
                         </div>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-xs font-bold text-zinc-500 uppercase">Ataques/Rodada</span>
                         <span className="text-white font-mono">1/1</span>
                      </div>
                   </div>

                   {/* Saving Throws */}
                   <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
                      <h3 className="text-xs font-bold text-zinc-500 uppercase mb-3">Salvaguardas</h3>
                      <div className="grid grid-cols-5 gap-1 text-center">
                        <div className="bg-zinc-900 p-1 rounded cursor-help" title="Veneno/Morte">
                          <Skull className="w-4 h-4 mx-auto mb-1 text-green-500" />
                          <span className="text-xs font-bold text-white">{character.saving_throws.poison}</span>
                        </div>
                        <div className="bg-zinc-900 p-1 rounded cursor-help" title="Varinha">
                          <Zap className="w-4 h-4 mx-auto mb-1 text-purple-500" />
                          <span className="text-xs font-bold text-white">{character.saving_throws.rod}</span>
                        </div>
                         <div className="bg-zinc-900 p-1 rounded cursor-help" title="Petrificação">
                          <Mountain className="w-4 h-4 mx-auto mb-1 text-yellow-600" />
                          <span className="text-xs font-bold text-white">{character.saving_throws.petrification}</span>
                        </div>
                         <div className="bg-zinc-900 p-1 rounded cursor-help" title="Sopro">
                          <Wind className="w-4 h-4 mx-auto mb-1 text-red-500" />
                          <span className="text-xs font-bold text-white">{character.saving_throws.breath}</span>
                        </div>
                         <div className="bg-zinc-900 p-1 rounded cursor-help" title="Magia">
                          <Ghost className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                          <span className="text-xs font-bold text-white">{character.saving_throws.spell}</span>
                        </div>
                      </div>
                   </div>
                </div>

                {/* Weapons Table */}
                <div>
                   <h3 className="text-xs font-bold text-zinc-500 uppercase mb-2">Armas Equipadas</h3>
                   <SolidTable headers={['Arma', 'Ajuste', 'Dano', 'Tam', 'Vel', 'Tipo']}>
                      {character.equipment.filter(i => i.type === 'weapon').map((w, i) => (
                        <tr key={i} className="hover:bg-zinc-800">
                           <td className="px-3 py-3 text-white font-bold">{w.item_name}</td>
                           <td className="px-3 py-3 text-green-400">+2</td>
                           <td className="px-3 py-3 text-zinc-300">{w.damage}</td>
                           <td className="px-3 py-3 text-zinc-500">{w.size}</td>
                           <td className="px-3 py-3 text-zinc-500">{w.speed}</td>
                           <td className="px-3 py-3 text-zinc-500">P</td>
                        </tr>
                      ))}
                   </SolidTable>
                </div>

                {/* Ammo Table */}
                <div>
                   <div className="flex justify-between items-center mb-2">
                       <h3 className="text-xs font-bold text-zinc-500 uppercase">Munição</h3>
                       <button className="text-xs text-gamer-super hover:underline flex items-center gap-1"><Plus className="w-3 h-3" /> Adicionar</button>
                    </div>
                   <SolidTable headers={['Nome', 'Qtd', 'Dano']}>
                      {character.ammo?.map((a, i) => (
                        <tr key={i} className="hover:bg-zinc-800">
                           <td className="px-3 py-3 text-white font-bold">{a.name}</td>
                           <td className="px-3 py-3 text-zinc-300">{a.quantity}</td>
                           <td className="px-3 py-3 text-zinc-400 font-mono">{a.damage}</td>
                        </tr>
                      ))}
                   </SolidTable>
                </div>

                {/* Thief Skills */}
                <div>
                   <h3 className="text-xs font-bold text-zinc-500 uppercase mb-2">Talentos de Ladino</h3>
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {character.thief_skills?.map((s, i) => (
                        <div key={i} className="flex items-center justify-between bg-zinc-950 border border-zinc-800 p-2 rounded hover:border-zinc-600">
                           <span className="text-[10px] text-zinc-400 uppercase">{s.skill}</span>
                           <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-gamer-super">{s.value}%</span>
                              <button className="hover:text-white text-zinc-600"><Dices className="w-3 h-3" /></button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
           )}

           {/* TAB: INVENTORY */}
           {activeTab === 'inventory' && (
             <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Money */}
                  <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 flex flex-col justify-between">
                     <h3 className="text-xs font-bold text-zinc-500 uppercase mb-3">Riqueza</h3>
                     <div className="grid grid-cols-5 gap-2 text-center font-mono">
                        <div><div className="text-[10px] text-yellow-200">PP</div><div className="text-sm font-bold">{character.money?.pp}</div></div>
                        <div><div className="text-[10px] text-yellow-400">PO</div><div className="text-sm font-bold">{character.money?.gp}</div></div>
                        <div><div className="text-[10px] text-blue-200">PE</div><div className="text-sm font-bold">{character.money?.ep}</div></div>
                        <div><div className="text-[10px] text-zinc-300">PP</div><div className="text-sm font-bold">{character.money?.sp}</div></div>
                        <div><div className="text-[10px] text-orange-700">PC</div><div className="text-sm font-bold">{character.money?.cp}</div></div>
                     </div>
                  </div>
                  
                  {/* Encumbrance */}
                  <div className="md:col-span-2 bg-zinc-950 border border-zinc-800 rounded-lg p-4">
                     <div className="flex justify-between items-end mb-2">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase">Carga Total</h3>
                        <span className="text-xs font-mono text-white">{character.encumbrance?.current} / {character.encumbrance?.max} kg</span>
                     </div>
                     <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-zinc-600" style={{ width: `${((character.encumbrance?.current || 0) / (character.encumbrance?.max || 1)) * 100}%` }} />
                     </div>
                     <div className="mt-2 flex gap-4 text-[10px] text-zinc-500 uppercase">
                        <span>Leve: 20kg</span>
                        <span>Médio: 40kg</span>
                        <span>Pesado: 60kg</span>
                     </div>
                  </div>
               </div>

               {/* Tables by Category */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                     <h3 className="text-xs font-bold text-zinc-500 uppercase mb-2 text-red-500">Armas</h3>
                     <SolidTable headers={['Nome', 'Peso', 'Qtd']}>
                        {character.equipment.filter(i => i.type === 'weapon').map((item, i) => (
                           <tr key={i} className="hover:bg-zinc-800">
                              <td className="px-3 py-2 text-white">{item.item_name} {item.is_equipped && '✅'}</td>
                              <td className="px-3 py-2 text-zinc-500">{item.weight}</td>
                              <td className="px-3 py-2 text-zinc-400">{item.quantity}</td>
                           </tr>
                        ))}
                     </SolidTable>
                  </div>
                  <div>
                     <h3 className="text-xs font-bold text-zinc-500 uppercase mb-2 text-blue-500">Armaduras</h3>
                     <SolidTable headers={['Nome', 'AC', 'Peso']}>
                        {character.equipment.filter(i => i.type === 'armor').map((item, i) => (
                           <tr key={i} className="hover:bg-zinc-800">
                              <td className="px-3 py-2 text-white">{item.item_name} {item.is_equipped && '✅'}</td>
                              <td className="px-3 py-2 text-green-400">+{item.ac_bonus}</td>
                              <td className="px-3 py-2 text-zinc-500">{item.weight}</td>
                           </tr>
                        ))}
                     </SolidTable>
                  </div>
                  <div>
                     <h3 className="text-xs font-bold text-zinc-500 uppercase mb-2 text-yellow-500">Mágicos & Poções</h3>
                     <SolidTable headers={['Nome', 'Qtd', 'Peso']}>
                        {character.equipment.filter(i => i.type === 'magic' || i.type === 'potion').map((item, i) => (
                           <tr key={i} className="hover:bg-zinc-800">
                              <td className="px-3 py-2 text-white">{item.item_name}</td>
                              <td className="px-3 py-2 text-zinc-400">{item.quantity}</td>
                              <td className="px-3 py-2 text-zinc-500">{item.weight}</td>
                           </tr>
                        ))}
                     </SolidTable>
                  </div>
                   <div>
                     <h3 className="text-xs font-bold text-zinc-500 uppercase mb-2 text-zinc-400">Itens Diversos</h3>
                     <SolidTable headers={['Nome', 'Qtd', 'Peso']}>
                        {character.equipment.filter(i => i.type === 'common').map((item, i) => (
                           <tr key={i} className="hover:bg-zinc-800">
                              <td className="px-3 py-2 text-white">{item.item_name}</td>
                              <td className="px-3 py-2 text-zinc-400">{item.quantity}</td>
                              <td className="px-3 py-2 text-zinc-500">{item.weight}</td>
                           </tr>
                        ))}
                     </SolidTable>
                  </div>
               </div>
             </div>
           )}

           {/* TAB: MAGIC */}
           {activeTab === 'magic' && (
             <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
                {/* Header Info */}
                <div className="flex items-center gap-4">
                   <div className="px-4 py-2 bg-purple-900/20 border border-purple-500/50 text-purple-400 rounded text-xs font-bold uppercase tracking-widest">
                      Origem: Arcano
                   </div>
                </div>

                {/* Slots Matrix */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
                   <h3 className="text-xs font-bold text-zinc-500 uppercase mb-3">Slots de Magia</h3>
                   <div className="flex flex-wrap gap-2">
                      {[1,2,3,4,5,6,7,8,9].map(lvl => (
                        <div key={lvl} className="flex flex-col items-center bg-zinc-900 p-2 rounded border border-zinc-800 min-w-[50px]">
                           <span className="text-[9px] text-zinc-500 font-bold mb-1">{lvl}º</span>
                           <div className="flex items-center gap-1 text-sm font-mono">
                              <span className="text-white font-bold">0</span>
                              <span className="text-zinc-600">/</span>
                              <span className="text-zinc-400">0</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Memorized Spells */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                     <h3 className="text-xs font-bold text-zinc-500 uppercase">Grimório / Memorizadas</h3>
                     <button className="text-xs text-gamer-super hover:underline">+ Adicionar</button>
                  </div>
                  <SolidTable headers={['Círculo', 'Nome', 'Escola', 'Mem', 'Usada']}>
                     <tr className="hover:bg-zinc-800">
                        <td className="px-3 py-2 text-zinc-500 font-bold">1º</td>
                        <td className="px-3 py-2 text-white">Mísseis Mágicos</td>
                        <td className="px-3 py-2 text-zinc-400">Evocação</td>
                        <td className="px-3 py-2"><input type="checkbox" className="accent-gamer-super" /></td>
                        <td className="px-3 py-2"><input type="checkbox" className="accent-red-500" /></td>
                     </tr>
                     <tr className="hover:bg-zinc-800">
                        <td className="px-3 py-2 text-zinc-500 font-bold">1º</td>
                        <td className="px-3 py-2 text-white">Armadura Arcana</td>
                        <td className="px-3 py-2 text-zinc-400">Abjuração</td>
                        <td className="px-3 py-2"><input type="checkbox" className="accent-gamer-super" /></td>
                        <td className="px-3 py-2"><input type="checkbox" className="accent-red-500" /></td>
                     </tr>
                  </SolidTable>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
