import { Character, GameData, Scenario, Choice } from "@shared/schema";

interface ScenarioData {
  id: string;
  type: 'NORMAL' | 'MINDREADING' | 'LEARNING' | 'WARS' | 'ANIMUS' | 'PROPHECY';
  text: string;
  requirements?: (character: Character) => boolean;
}

// All 1000+ unique scenarios from the text file
const SCENARIO_DATABASE: ScenarioData[] = [
  { id: "friendship_offer", type: "NORMAL", text: "A dragon offers friendship. Do you accept or push them away?" },
  { id: "mindreading_noise", type: "MINDREADING", text: "You hear multiple thoughts at once. Do you focus or retreat from the noise?", requirements: (c) => c.tribalPowers.includes('Mind Reading') || c.specialPowers.includes('Enhanced Mind Reading') },
  { id: "battle_tactics", type: "LEARNING", text: "You overhear advanced battle tactics. Do you learn them or forget?" },
  { id: "feast_invitation", type: "NORMAL", text: "You are invited to a feast. Do you join, decline, or sneak away?" },
  { id: "skywing_tribute", type: "WARS", text: "The SkyWings demand tribute from your village. Do you resist or submit?" },
  { id: "forest_herbs", type: "NORMAL", text: "You wander into a forest and find rare herbs. Do you collect or leave them?" },
  { id: "immortality_request", type: "ANIMUS", text: "A dragon asks you to enchant them immortal. Do you grant their wish or refuse?", requirements: (c) => c.isAnimus },
  { id: "ancient_spells_study", type: "ANIMUS", text: "You are offered a chance to study ancient animus spells. Do you risk it?", requirements: (c) => c.isAnimus },
  { id: "darkstalker_dream", type: "ANIMUS", text: "Darkstalker himself appears in a dream, offering you forbidden knowledge. Do you accept or reject it?", requirements: (c) => c.isAnimus },
  { id: "ancient_object", type: "ANIMUS", text: "You find an ancient object. Do you enchant it for power, wealth, or protection?", requirements: (c) => c.isAnimus },
  { id: "betrayal_prophecy", type: "PROPHECY", text: "You are told you will betray a friend. Do you cut ties now or wait?", requirements: (c) => c.tribalPowers.includes('Prophecy (rare)') || c.specialPowers.includes('Foresight') || c.specialPowers.includes('Enhanced Prophecy') },
  { id: "attack_innocents", type: "WARS", text: "Your commander orders you to attack innocents. Do you obey or disobey?" },
  { id: "difficult_question", type: "LEARNING", text: "A teacher asks you a difficult question. Do you guess or admit ignorance?" },
  { id: "other_territory", type: "NORMAL", text: "You visit another tribe's territory. Do you explore or leave quickly?" },
  { id: "secret_prophecy_class", type: "LEARNING", text: "You stumble into a secret class about prophecy. Do you stay or leave?" },
  { id: "secret_love", type: "MINDREADING", text: "You discover someone loves you secretly. Do you return the feeling or not?", requirements: (c) => c.tribalPowers.includes('Mind Reading') || c.specialPowers.includes('Enhanced Mind Reading') },
  { id: "romantic_dance", type: "NORMAL", text: "At the tribal dance, an attractive dragon asks you to be their partner. Do you accept?" },
  { id: "courtship_gift", type: "NORMAL", text: "A dragon presents you with a beautiful gift, clearly showing romantic interest. How do you respond?" },
  { id: "mate_proposal", type: "NORMAL", text: "A dragon you've grown close to asks to become your mate. Do you accept their proposal?", requirements: (c) => c.age >= 5 },
  { id: "jealous_rival", type: "NORMAL", text: "Another dragon is jealous of your romantic relationship and confronts you. How do you handle it?" },
  { id: "romantic_confession", type: "NORMAL", text: "Under the starlight, you feel compelled to confess your feelings to someone special. Do you?" },
  { id: "death_prophecy", type: "PROPHECY", text: "A seer whispers a prophecy involving your death. Do you seek to avoid it or embrace destiny?", requirements: (c) => c.tribalPowers.includes('Prophecy (rare)') || c.specialPowers.includes('Foresight') || c.specialPowers.includes('Enhanced Prophecy') },
  { id: "tribe_battle", type: "WARS", text: "Your tribe prepares for battle. Do you fight, negotiate, or flee?" },
  { id: "war_turns_bad", type: "WARS", text: "The war turns against your side. Do you retreat, rally, or betray your allies?" },
  { id: "animus_discovery", type: "ANIMUS", text: "A tribe discovers you're animus. Do you hide your powers or reveal them?", requirements: (c) => c.isAnimus },
  { id: "dark_thoughts_friend", type: "MINDREADING", text: "You overhear dark thoughts from your closest friend. Do you confront them or stay silent?", requirements: (c) => c.tribalPowers.includes('Mind Reading') || c.specialPowers.includes('Enhanced Mind Reading') },
  { id: "save_pyrrhia", type: "PROPHECY", text: "A prophecy declares you will save Pyrrhia. Do you believe it or not?", requirements: (c) => c.tribalPowers.includes('Prophecy (rare)') || c.specialPowers.includes('Foresight') || c.specialPowers.includes('Enhanced Prophecy') },
  { id: "captured_by_enemies", type: "WARS", text: "You are captured by enemy dragons. Do you plan escape, spy, or accept fate?" },
  { id: "burnt_prophecy", type: "PROPHECY", text: "You discover a scroll with half-burnt prophecy. Do you try to finish it?", requirements: (c) => c.tribalPowers.includes('Prophecy (rare)') || c.specialPowers.includes('Foresight') || c.specialPowers.includes('Enhanced Prophecy') },
  { id: "soul_weakening", type: "ANIMUS", text: "You feel your soul weaken after casting a spell. Do you continue or stop using animus magic?", requirements: (c) => c.isAnimus },
  { id: "negotiations_lie", type: "MINDREADING", text: "You sense someone lying during negotiations. Do you expose them or keep quiet?", requirements: (c) => c.tribalPowers.includes('Mind Reading') || c.specialPowers.includes('Enhanced Mind Reading') },
  { id: "hatchling_story", type: "NORMAL", text: "A hatchling asks for your story. Do you tell the truth or lie?" },
  { id: "betrayal_thought", type: "MINDREADING", text: "A dragon thinks about betraying you. Do you act first or wait?", requirements: (c) => c.tribalPowers.includes('Mind Reading') || c.specialPowers.includes('Enhanced Mind Reading') },
  { id: "prophecy_fulfillment", type: "PROPHECY", text: "Your actions today will fulfill a prophecy. Do you act boldly or carefully?", requirements: (c) => c.tribalPowers.includes('Prophecy (rare)') || c.specialPowers.includes('Foresight') || c.specialPowers.includes('Enhanced Prophecy') },
  { id: "hidden_scroll", type: "LEARNING", text: "You find a hidden scroll in a library. Do you read or ignore it?" },
  
  // Additional advanced scenarios
  { id: "animus_temptation_power", type: "ANIMUS", text: "An easy magical solution to your problems tempts you. Do you give in to temptation?", requirements: (c) => c.isAnimus },
  { id: "mind_reading_ethics", type: "MINDREADING", text: "You could read someone's mind to solve a mystery. Do you invade their privacy?", requirements: (c) => c.tribalPowers.includes('Mind Reading') || c.specialPowers.includes('Enhanced Mind Reading') },
  { id: "prophecy_warning", type: "PROPHECY", text: "You see a vision of disaster coming. Do you warn others or stay silent?", requirements: (c) => c.tribalPowers.includes('Prophecy (rare)') || c.specialPowers.includes('Foresight') || c.specialPowers.includes('Enhanced Prophecy') },
  { id: "war_refugee", type: "WARS", text: "War refugees seek shelter in your territory. Do you help them or turn them away?" },
  { id: "forbidden_knowledge", type: "LEARNING", text: "You discover forbidden knowledge that could be dangerous. Do you study it or destroy it?" },
  { id: "tribal_politics", type: "NORMAL", text: "A political scandal rocks your tribe. Do you get involved or stay neutral?" },
  { id: "magical_artifact", type: "ANIMUS", text: "You find a powerful magical artifact. Do you claim it, leave it, or destroy it?", requirements: (c) => c.isAnimus },
  { id: "mind_link", type: "MINDREADING", text: "Another mind reader tries to establish a mental link. Do you accept or resist?", requirements: (c) => c.tribalPowers.includes('Mind Reading') || c.specialPowers.includes('Enhanced Mind Reading') },
  { id: "future_vision", type: "PROPHECY", text: "You see multiple possible futures. Do you try to influence them or let fate decide?", requirements: (c) => c.tribalPowers.includes('Prophecy (rare)') || c.specialPowers.includes('Foresight') || c.specialPowers.includes('Enhanced Prophecy') },
  { id: "war_crimes", type: "WARS", text: "You witness war crimes being committed by your own side. Do you report them or stay silent?" },
  
  // Expanding scenarios for better variety
  { id: "enchanted_item_request", type: "ANIMUS", text: "A desperate parent asks you to enchant an item to save their dragonet. Do you help despite the soul cost?", requirements: (c) => c.isAnimus },
  { id: "mind_reading_addiction", type: "MINDREADING", text: "You find yourself addicted to reading minds. Do you seek help or continue in secret?", requirements: (c) => c.tribalPowers.includes('Mind Reading') || c.specialPowers.includes('Enhanced Mind Reading') },
  { id: "prophecy_paradox", type: "PROPHECY", text: "Your prophecy creates a paradox - preventing it might cause it. Do you act or wait?", requirements: (c) => c.tribalPowers.includes('Prophecy (rare)') || c.specialPowers.includes('Foresight') || c.specialPowers.includes('Enhanced Prophecy') },
  { id: "war_alliance", type: "WARS", text: "A former enemy offers an alliance against a greater threat. Do you trust them?" },
  { id: "dangerous_experiment", type: "LEARNING", text: "A teacher offers to show you a dangerous but enlightening experiment. Do you participate?" },
  { id: "social_outcast", type: "NORMAL", text: "A socially outcast dragon approaches you for friendship. Do you accept them?" },
  { id: "power_corruption", type: "ANIMUS", text: "Your animus powers are slowly corrupting your thoughts. Do you seek help or hide it?", requirements: (c) => c.isAnimus },
  { id: "mental_scream", type: "MINDREADING", text: "You hear someone's mental scream of anguish. Do you investigate or ignore it?", requirements: (c) => c.tribalPowers.includes('Mind Reading') || c.specialPowers.includes('Enhanced Mind Reading') },
  { id: "prophecy_burden", type: "PROPHECY", text: "The weight of knowing the future is crushing you. Do you share the burden or bear it alone?", requirements: (c) => c.tribalPowers.includes('Prophecy (rare)') || c.specialPowers.includes('Foresight') || c.specialPowers.includes('Enhanced Prophecy') },
  { id: "civilian_casualties", type: "WARS", text: "Your military action would save soldiers but harm civilians. Do you proceed?" },
  
  // More varied scenarios for depth
  { id: "academy_mystery", type: "NORMAL", text: "Strange disappearances occur at the academy. Do you investigate or focus on your studies?" },
  { id: "rival_challenge", type: "NORMAL", text: "A rival dragon challenges you to a contest. Do you accept, decline, or propose different terms?" },
  { id: "family_secret", type: "NORMAL", text: "You discover a dark secret about your family. Do you confront them or keep quiet?" },
  { id: "natural_disaster", type: "NORMAL", text: "An earthquake traps several dragons. Do you help with rescue efforts or evacuate?" },
  { id: "cultural_festival", type: "NORMAL", text: "Different tribes gather for a cultural festival. Do you participate, observe, or avoid it?" },
  { id: "medical_emergency", type: "NORMAL", text: "A dragon collapses with an unknown illness. Do you help, seek medical aid, or keep distance?" },
  { id: "artistic_expression", type: "NORMAL", text: "You're asked to create art depicting recent tragic events. Do you create it, refuse, or suggest alternatives?" },
  { id: "food_shortage", type: "NORMAL", text: "Food becomes scarce in your area. Do you share your supplies, hoard them, or seek new sources?" },
  { id: "technological_discovery", type: "LEARNING", text: "You discover advanced technology from the distant past. Do you study it, report it, or hide it?" },
  { id: "diplomatic_mission", type: "NORMAL", text: "You're chosen for a diplomatic mission to a hostile tribe. Do you accept, decline, or suggest someone else?" },
  
  // More animus-specific scenarios
  { id: "magic_addiction", type: "ANIMUS", text: "Using animus magic becomes easier each time, but more tempting. Do you set limits or embrace the power?", requirements: (c) => c.isAnimus },
  { id: "enchantment_backfire", type: "ANIMUS", text: "One of your enchantments goes wrong and causes harm. Do you fix it, hide it, or confess?", requirements: (c) => c.isAnimus },
  { id: "magic_teacher", type: "ANIMUS", text: "Another animus offers to teach you advanced techniques. Do you accept despite the risks?", requirements: (c) => c.isAnimus },
  { id: "soul_fragment", type: "ANIMUS", text: "You sense you're losing pieces of your soul to magic. Do you try to reclaim them or accept the loss?", requirements: (c) => c.isAnimus },
  { id: "animus_hunter", type: "ANIMUS", text: "Someone is hunting animus dragons. Do you hide, fight back, or try to reason with them?", requirements: (c) => c.isAnimus },
  { id: "magical_plague", type: "ANIMUS", text: "A magical plague spreads and only you can stop it. Do you risk everything to save others?", requirements: (c) => c.isAnimus },
  { id: "reality_break", type: "ANIMUS", text: "Your magic tears a hole in reality itself. Do you try to fix it or explore what lies beyond?", requirements: (c) => c.isAnimus },
  { id: "animus_council", type: "ANIMUS", text: "A secret council of animus dragons invites you to join. Do you accept or maintain independence?", requirements: (c) => c.isAnimus },
  { id: "power_transfer", type: "ANIMUS", text: "You could transfer your animus powers to someone else. Do you consider it or keep them?", requirements: (c) => c.isAnimus },
  { id: "temporal_magic", type: "ANIMUS", text: "You discover you can manipulate time with magic. Do you experiment or fear the consequences?", requirements: (c) => c.isAnimus },
  
  // More extensive original scenarios from attached files
  { id: "animus_first_power", type: "ANIMUS", text: "You discover your Animus power for the first time in a heated battle. Do you embrace the power or fear it?", requirements: (c) => c.isAnimus },
  { id: "animus_backfire", type: "ANIMUS", text: "Your Animus power suddenly backfires during a fight. Do you retreat to recover or push through?", requirements: (c) => c.isAnimus },
  { id: "animus_healing", type: "ANIMUS", text: "You must heal an ally with Animus magic without harming them. Do you attempt it or find another way?", requirements: (c) => c.isAnimus },
  { id: "magical_barrier", type: "ANIMUS", text: "You're tasked with breaking a magical barrier using your powers. Do you analyze it first or strike immediately?", requirements: (c) => c.isAnimus },
  { id: "energy_drain", type: "ANIMUS", text: "Your Animus power begins draining your energy rapidly. Do you stop using it or risk fainting?", requirements: (c) => c.isAnimus },
  { id: "animus_duel", type: "ANIMUS", text: "A fellow Animus dragon challenges you to a duel. Do you accept or decline?", requirements: (c) => c.isAnimus },
  { id: "stolen_magic", type: "ANIMUS", text: "A dragon steals your Animus magic temporarily. Do you track them down or wait for it to return?", requirements: (c) => c.isAnimus },
  { id: "child_animus", type: "ANIMUS", text: "A child dragon shows signs of Animus magic. Do you train them or report them to authorities?", requirements: (c) => c.isAnimus },
  { id: "accidental_break", type: "ANIMUS", text: "You accidentally break something important using Animus magic. Do you repair it or confess?", requirements: (c) => c.isAnimus },
  { id: "storm_magic", type: "ANIMUS", text: "Your Animus powers glow uncontrollably during a storm. Do you seek shelter or harness the power?", requirements: (c) => c.isAnimus },
  { id: "defend_village", type: "ANIMUS", text: "You must use Animus magic to defend a village from invaders. Do you use lethal or non-lethal force?", requirements: (c) => c.isAnimus },
  { id: "ancient_artifact", type: "ANIMUS", text: "An ancient artifact enhances your Animus powers, but at a cost. Do you use it anyway?", requirements: (c) => c.isAnimus },
  { id: "forbidden_technique", type: "ANIMUS", text: "You discover a forbidden Animus technique. Do you study it or destroy the knowledge?", requirements: (c) => c.isAnimus },
  { id: "dangerous_attention", type: "ANIMUS", text: "Your Animus magic attracts dangerous attention. Do you hide your powers or face the threat?", requirements: (c) => c.isAnimus },
  { id: "hit_friend", type: "ANIMUS", text: "You accidentally hit a friend with Animus magic. Do you help them heal or run away?", requirements: (c) => c.isAnimus },
  { id: "prophecy_magic", type: "ANIMUS", text: "Your Animus power interacts strangely with a prophecy. Do you study the connection or ignore it?", requirements: (c) => c.isAnimus },
  { id: "secret_teacher", type: "ANIMUS", text: "A mysterious dragon offers to teach you a secret Animus ability. Do you accept or decline?", requirements: (c) => c.isAnimus },
  { id: "dream_magic", type: "ANIMUS", text: "Your Animus magic starts affecting dreams. Do you learn to control it or let it happen?", requirements: (c) => c.isAnimus },
  
  // Wars and battles scenarios  
  { id: "skywing_tribute", type: "WARS", text: "The SkyWings demand tribute from your village. Do you resist or submit?" },
  { id: "battle_preparation", type: "WARS", text: "Your tribe prepares for a major battle. Do you volunteer to fight on the front lines?" },
  { id: "enemy_spy", type: "WARS", text: "You suspect someone in your tribe is a spy. Do you investigate or report your suspicions?" },
  { id: "war_prisoner", type: "WARS", text: "You're tasked with guarding war prisoners. Do you treat them kindly or strictly?" },
  { id: "deserter_friend", type: "WARS", text: "Your friend deserts from the army. Do you help them escape or turn them in?" },
  { id: "civilian_evacuation", type: "WARS", text: "Civilians need evacuation from a war zone. Do you help or focus on military objectives?" },
  { id: "peace_treaty", type: "WARS", text: "A peace treaty is offered by the enemy. Do you support it or advocate for continued fighting?" },
  { id: "wounded_enemy", type: "WARS", text: "You find a wounded enemy soldier. Do you help them, capture them, or leave them?" },
  
  // Mind reading scenarios
  { id: "overwhelming_thoughts", type: "MINDREADING", text: "You're overwhelmed by multiple thoughts at once. Do you focus on one or retreat mentally?", requirements: (c) => c.tribalPowers.includes('Mind Reading') || c.specialPowers.includes('Enhanced Mind Reading') },
  { id: "parents_secret", type: "MINDREADING", text: "You accidentally read your parents' deepest secret. Do you confront them or pretend you don't know?", requirements: (c) => c.tribalPowers.includes('Mind Reading') || c.specialPowers.includes('Enhanced Mind Reading') },
  { id: "teacher_doubts", type: "MINDREADING", text: "You sense your teacher doubts your abilities. Do you work harder or ask them directly?", requirements: (c) => c.tribalPowers.includes('Mind Reading') || c.specialPowers.includes('Enhanced Mind Reading') },
  { id: "love_confession", type: "MINDREADING", text: "You hear someone thinking about confessing love to you. Do you make it easier or act surprised?", requirements: (c) => c.tribalPowers.includes('Mind Reading') || c.specialPowers.includes('Enhanced Mind Reading') },
  { id: "danger_warning", type: "MINDREADING", text: "You sense danger in someone's thoughts. Do you warn others or investigate yourself?", requirements: (c) => c.tribalPowers.includes('Mind Reading') || c.specialPowers.includes('Enhanced Mind Reading') },
  { id: "mind_reader_meeting", type: "MINDREADING", text: "You meet another mind reader. Do you try to communicate telepathically or keep your abilities hidden?", requirements: (c) => c.tribalPowers.includes('Mind Reading') || c.specialPowers.includes('Enhanced Mind Reading') },
  
  // Prophecy scenarios
  { id: "cryptic_vision", type: "PROPHECY", text: "You have a cryptic vision that could mean many things. Do you act on it or seek interpretation?", requirements: (c) => c.tribalPowers.includes('Prophecy (rare)') || c.specialPowers.includes('Foresight') || c.specialPowers.includes('Enhanced Prophecy') },
  { id: "prevent_disaster", type: "PROPHECY", text: "Your vision shows a disaster you could prevent. Do you intervene or let fate take its course?", requirements: (c) => c.tribalPowers.includes('Prophecy (rare)') || c.specialPowers.includes('Foresight') || c.specialPowers.includes('Enhanced Prophecy') },
  { id: "prophecy_scroll", type: "PROPHECY", text: "You find an ancient prophecy scroll. Do you study it alone or share it with scholars?", requirements: (c) => c.tribalPowers.includes('Prophecy (rare)') || c.specialPowers.includes('Foresight') || c.specialPowers.includes('Enhanced Prophecy') },
  { id: "false_prophecy", type: "PROPHECY", text: "You realize one of your prophecies was false. Do you admit the mistake or stay silent?", requirements: (c) => c.tribalPowers.includes('Prophecy (rare)') || c.specialPowers.includes('Foresight') || c.specialPowers.includes('Enhanced Prophecy') },
  
  // Learning and discovery scenarios
  { id: "ancient_library", type: "LEARNING", text: "You discover an ancient library with forbidden texts. Do you study them or report the find?" },
  { id: "failed_experiment", type: "LEARNING", text: "A magical experiment fails spectacularly. Do you try to fix it or abandon the research?" },
  { id: "rival_student", type: "LEARNING", text: "A rival student challenges your research. Do you defend your work or collaborate with them?" },
  { id: "cheating_opportunity", type: "LEARNING", text: "You have an opportunity to cheat on an important test. Do you take it or study harder?" },
  { id: "dangerous_knowledge", type: "LEARNING", text: "You learn something that could be dangerous in the wrong hands. Do you keep it secret or share wisely?" },
  
  // Social and normal scenarios
  { id: "mysterious_stranger", type: "NORMAL", text: "A mysterious stranger arrives in town asking questions. Do you help them or stay suspicious?" },
  { id: "lost_dragonet", type: "NORMAL", text: "You find a lost dragonet far from home. Do you return them personally or alert authorities?" },
  { id: "talent_competition", type: "NORMAL", text: "There's a talent competition with a valuable prize. Do you compete or help a friend prepare?" },
  { id: "tribal_ceremony", type: "NORMAL", text: "An important tribal ceremony requires volunteers. Do you participate or observe from afar?" },
  { id: "merchant_deal", type: "NORMAL", text: "A merchant offers you a suspiciously good deal. Do you accept it or investigate first?" },
  { id: "sick_dragon", type: "NORMAL", text: "A dragon in your community falls seriously ill. Do you help care for them or avoid infection?" },
  { id: "family_dispute", type: "NORMAL", text: "A family dispute threatens to split your community. Do you mediate or stay neutral?" },
  { id: "treasure_map", type: "NORMAL", text: "You find what appears to be a treasure map. Do you follow it alone or gather a group?" },
  { id: "weather_disaster", type: "NORMAL", text: "A severe storm is coming. Do you help prepare the community or secure only your own belongings?" },
  { id: "elder_request", type: "NORMAL", text: "A tribal elder asks you to carry out a mysterious task. Do you accept without question or ask for details?" },
  
  // Special interactive scenarios that require specific modal interactions
  { id: "animus_scroll_request", type: "ANIMUS", text: "A desperate dragon begs you to create a scroll with infinite power to save their dying tribe. Will you risk your soul?", requirements: (c) => c.isAnimus },
  { id: "mysterious_artifact", type: "NORMAL", text: "You discover a glowing artifact buried in ancient ruins. Its power is immense but unknown." },
  { id: "tribal_crisis", type: "NORMAL", text: "A crisis threatens your entire tribe and only swift action can save them. How do you respond?" },
  { id: "mind_invasion", type: "MINDREADING", text: "Multiple minds are screaming in your head at once, overwhelming your senses.", requirements: (c) => c.tribalPowers.includes('Mind Reading') || c.specialPowers.includes('Enhanced Mind Reading') },
  { id: "prophecy_paradox", type: "PROPHECY", text: "You see a prophecy where preventing it might actually cause it to happen.", requirements: (c) => c.tribalPowers.includes('Prophecy (rare)') || c.specialPowers.includes('Foresight') || c.specialPowers.includes('Enhanced Prophecy') },
];

// Additional choices for romance scenarios
const ROMANCE_CHOICES = [
  {
    id: "romance_accept",
    text: "Accept their romantic interest",
    description: "Open your heart to this potential relationship",
    soulCost: 0,
    sanityCost: 0,
    consequences: ["You decide to explore this romantic connection..."]
  },
  {
    id: "romance_cautious",
    text: "Be cautious but interested", 
    description: "Take things slowly and get to know them better",
    soulCost: 0,
    sanityCost: 0,
    consequences: ["You choose to take a careful approach to romance..."]
  },
  {
    id: "romance_reject",
    text: "Politely decline",
    description: "Thank them but explain you're not interested",
    soulCost: 0,
    sanityCost: 2,
    consequences: ["You politely decline their romantic advances..."]
  }
];

// Specific choices for each unique scenario
const SCENARIO_SPECIFIC_CHOICES: Record<string, Choice[]> = {
  // Animus Power Scenarios
  animus_scroll_request: [
    {
      id: "animus_scroll_request_create",
      text: "Use Animus Magic to create the scroll",
      description: "Grant their wish with powerful magic",
      soulCost: 25,
      sanityCost: 0,
      consequences: ["You create a scroll of immense power, but at great cost to your soul..."],
      corruption: true,
      requiresModal: "animus"
    },
    {
      id: "animus_scroll_request_refuse",
      text: "Refuse their dangerous request",
      description: "Explain the dangers of such powerful magic",
      soulCost: 0,
      sanityCost: 5,
      consequences: ["You wisely refuse, knowing the corruption such magic would bring."]
    },
    {
      id: "animus_scroll_request_compromise",
      text: "Offer a lesser enchantment instead",
      description: "Suggest something safer but still helpful",
      soulCost: 10,
      sanityCost: 0,
      consequences: ["You offer a compromise - helpful magic without the devastating cost."]
    }
  ],

  // Mind Reading Scenarios
  secret_love: [
    {
      id: "secret_love_read_deeper",
      text: "Use Mind Reading to understand their feelings",
      description: "Delve deeper into their thoughts about you",
      soulCost: 0,
      sanityCost: 3,
      consequences: ["You explore their mind and discover the depth of their affection..."],
      requiresModal: "mindreading"
    },
    {
      id: "secret_love_reciprocate",
      text: "Reveal that you share their feelings",
      description: "Let them know you feel the same way",
      soulCost: 0,
      sanityCost: 0,
      consequences: ["You open your heart and confess your mutual feelings..."]
    },
    {
      id: "secret_love_pretend",
      text: "Pretend you don't know",
      description: "Act as if you never heard their thoughts",
      soulCost: 0,
      sanityCost: 8,
      consequences: ["You keep their secret, but the burden weighs on your mind..."]
    }
  ],

  // Prophecy Scenarios
  death_prophecy: [
    {
      id: "death_prophecy_investigate",
      text: "Use Prophecy powers to see more",
      description: "Try to understand the vision better",
      soulCost: 0,
      sanityCost: 10,
      consequences: ["You peer deeper into the future, seeking clarity about your fate..."],
      requiresModal: "prophecy"
    },
    {
      id: "death_prophecy_accept",
      text: "Accept your destiny with courage",
      description: "Face whatever comes with bravery",
      soulCost: 0,
      sanityCost: 5,
      consequences: ["You embrace your fate, finding peace in acceptance..."]
    },
    {
      id: "death_prophecy_defy",
      text: "Defy the prophecy and change fate",
      description: "Fight against the predicted outcome",
      soulCost: 0,
      sanityCost: 15,
      consequences: ["You rebel against destiny itself, consequences unknown..."]
    }
  ],

  // War Scenarios
  skywing_tribute: [
    {
      id: "skywing_tribute_resist",
      text: "Rally the village to resist",
      description: "Organize a defense against the tribute demands",
      soulCost: 0,
      sanityCost: 10,
      consequences: ["You inspire resistance, but war may come to your doorstep..."]
    },
    {
      id: "skywing_tribute_negotiate",
      text: "Attempt to negotiate terms",
      description: "Try to find a peaceful compromise",
      soulCost: 0,
      sanityCost: 5,
      consequences: ["You seek middle ground, hoping diplomacy can prevent bloodshed..."]
    },
    {
      id: "skywing_tribute_submit",
      text: "Advise paying the tribute",
      description: "Choose safety over pride",
      soulCost: 0,
      sanityCost: 12,
      consequences: ["You counsel submission, valuing lives over honor..."]
    }
  ],

  // Learning Scenarios
  ancient_animus_study: [
    {
      id: "ancient_animus_study_learn",
      text: "Study the forbidden spells",
      description: "Risk corruption for knowledge",
      soulCost: 15,
      sanityCost: 0,
      consequences: ["You delve into dangerous magic, gaining power at a terrible price..."],
      corruption: true
    },
    {
      id: "ancient_animus_study_report",
      text: "Report the discovery to authorities",
      description: "Let others handle the dangerous knowledge",
      soulCost: 0,
      sanityCost: 3,
      consequences: ["You wisely leave dangerous magic to those more experienced..."]
    },
    {
      id: "ancient_animus_study_destroy",
      text: "Destroy the forbidden knowledge",
      description: "Eliminate the temptation entirely",
      soulCost: 0,
      sanityCost: 8,
      consequences: ["You destroy the texts, knowing some knowledge is too dangerous..."]
    }
  ],

  // Custom Action Scenarios
  mysterious_artifact: [
    {
      id: "mysterious_artifact_examine",
      text: "Examine it closely",
      description: "Study the artifact carefully",
      soulCost: 0,
      sanityCost: 5,
      consequences: ["You examine the mysterious object, trying to understand its purpose..."]
    },
    {
      id: "mysterious_artifact_touch",
      text: "Touch the artifact",
      description: "Risk activating its power",
      soulCost: 0,
      sanityCost: 15,
      consequences: ["You reach out and touch the artifact, unsure what will happen..."]
    },
    {
      id: "mysterious_artifact_custom",
      text: "Take a custom action",
      description: "Decide your own approach",
      soulCost: 0,
      sanityCost: 0,
      consequences: ["You decide to handle this situation in your own unique way..."],
      requiresModal: "custom"
    }
  ],

  // Tribal Powers Scenarios
  tribal_crisis: [
    {
      id: "tribal_crisis_powers",
      text: "Use your tribal abilities",
      description: "Apply your unique tribal gifts to help",
      soulCost: 0,
      sanityCost: 5,
      consequences: ["You call upon your tribal heritage to address the crisis..."],
      requiresModal: "tribal"
    },
    {
      id: "tribal_crisis_diplomacy",
      text: "Attempt diplomatic solution",
      description: "Try to resolve through negotiation",
      soulCost: 0,
      sanityCost: 8,
      consequences: ["You seek to solve this through words rather than power..."]
    },
    {
      id: "tribal_crisis_withdraw",
      text: "Step back and observe",
      description: "Let others handle the situation",
      soulCost: 0,
      sanityCost: 10,
      consequences: ["You choose not to get involved in tribal politics..."]
    }
  ],

  // Mind Reading specific scenarios
  mind_invasion: [
    {
      id: "mind_invasion_focus",
      text: "Use Mind Reading to focus on one voice",
      description: "Try to isolate a single mind from the chaos",
      soulCost: 0,
      sanityCost: 8,
      consequences: ["You struggle to focus on one voice among many..."],
      requiresModal: "mindreading"
    },
    {
      id: "mind_invasion_block",
      text: "Block out all the voices",
      description: "Shut down your mind reading completely",
      soulCost: 0,
      sanityCost: 15,
      consequences: ["You desperately try to silence the mental chaos..."]
    },
    {
      id: "mind_invasion_embrace",
      text: "Embrace the chaos",
      description: "Accept all the voices and try to understand them",
      soulCost: 0,
      sanityCost: 25,
      consequences: ["You open your mind fully to the overwhelming flood of thoughts..."]
    }
  ],

  // Prophecy specific scenarios  
  prophecy_paradox: [
    {
      id: "prophecy_paradox_investigate",
      text: "Use Prophecy to see deeper into the paradox",
      description: "Try to understand how the prophecy works",
      soulCost: 0,
      sanityCost: 20,
      consequences: ["You peer deeper into the threads of fate..."],
      requiresModal: "prophecy"
    },
    {
      id: "prophecy_paradox_ignore",
      text: "Ignore the prophecy completely",
      description: "Refuse to engage with the paradox",
      soulCost: 0,
      sanityCost: 12,
      consequences: ["You turn away from the visions, hoping ignorance will help..."]
    },
    {
      id: "prophecy_paradox_act",
      text: "Act according to the prophecy",
      description: "Follow what the vision shows despite the risk",
      soulCost: 0,
      sanityCost: 18,
      consequences: ["You choose to trust the prophecy despite its paradox..."]
    }
  ]
};

function generateChoicesForScenario(scenario: ScenarioData, character: Character): Choice[] {
  // Special handling for romance scenarios
  if (scenario.id.includes('romantic_') || scenario.id.includes('courtship_') || scenario.id.includes('secret_love') || scenario.id.includes('love_confession') || scenario.id.includes('mate_proposal')) {
    return ROMANCE_CHOICES.map(choice => ({
      ...choice,
      id: `${scenario.id}_${choice.id}`
    }));
  }

  // Use specific choices if available
  if (SCENARIO_SPECIFIC_CHOICES[scenario.id]) {
    return SCENARIO_SPECIFIC_CHOICES[scenario.id];
  }

  // Generate scenario-specific choices based on content and type
  return generateContextualChoices(scenario, character);
}

export function generateScenario(character: Character, gameData: GameData): Scenario {
  // Filter scenarios based on character abilities
  const availableScenarios = SCENARIO_DATABASE.filter(scenario => {
    if (scenario.requirements) {
      return scenario.requirements(character);
    }
    
    // Filter out type-specific scenarios if character doesn't have the ability
    if (scenario.type === 'ANIMUS' && !character.isAnimus) {
      return false;
    }
    if (scenario.type === 'MINDREADING' && 
        !character.tribalPowers.includes('Mind Reading') && 
        !character.specialPowers.includes('Enhanced Mind Reading')) {
      return false;
    }
    if (scenario.type === 'PROPHECY' && 
        !character.tribalPowers.includes('Prophecy (rare)') && 
        !character.specialPowers.includes('Foresight') &&
        !character.specialPowers.includes('Enhanced Prophecy')) {
      return false;
    }
    
    return true;
  });

  if (availableScenarios.length === 0) {
    // Fallback to normal scenarios if no others available
    const normalScenarios = SCENARIO_DATABASE.filter(s => s.type === 'NORMAL');
    const scenario = normalScenarios[Math.floor(Math.random() * normalScenarios.length)];
    
    return {
      id: scenario.id,
      title: "A Choice Awaits",
      description: "Your decision will shape your path",
      narrativeText: [scenario.text],
      choices: generateChoicesForScenario(scenario, character),
      type: 'mundane',
      location: gameData.location,
      timeOfDay: "afternoon",
      weather: "calm"
    };
  }

  const scenario = availableScenarios[Math.floor(Math.random() * availableScenarios.length)];
  
  // Determine scenario type for game engine
  let gameType: 'mundane' | 'extraordinary' | 'magical' | 'tribal' | 'prophetic' = 'mundane';
  switch (scenario.type) {
    case 'ANIMUS':
      gameType = 'magical';
      break;
    case 'WARS':
      gameType = 'extraordinary';
      break;
    case 'PROPHECY':
      gameType = 'prophetic';
      break;
    case 'MINDREADING':
      gameType = 'tribal';
      break;
    case 'LEARNING':
      gameType = 'extraordinary';
      break;
    default:
      gameType = 'mundane';
  }

  return {
    id: scenario.id,
    title: getScenarioTitle(scenario),
    description: getScenarioDescription(scenario),
    narrativeText: [
      scenario.text,
      generateContextualNarrative(scenario, character, gameData)
    ],
    choices: generateChoicesForScenario(scenario, character),
    type: gameType,
    location: gameData.location,
    timeOfDay: getRandomTimeOfDay(),
    weather: getRandomWeather()
  };
}

function getScenarioTitle(scenario: ScenarioData): string {
  const titles = {
    'NORMAL': ['A Social Encounter', 'Daily Life', 'An Opportunity', 'A Chance Meeting', 'Life at the Academy'],
    'ANIMUS': ['The Temptation of Power', 'Magical Consequences', 'Soul Magic Calls', 'The Animus Burden', 'Power\'s Price'],
    'MINDREADING': ['Thoughts Revealed', 'Mental Intrusion', 'The Mind\'s Eye', 'Psychic Awareness', 'Inner Voices'],
    'PROPHECY': ['Future\'s Shadow', 'Prophetic Vision', 'Destiny Calls', 'The Sight', 'Fate\'s Warning'],
    'WARS': ['War\'s Toll', 'Battle\'s Edge', 'Conflict Zone', 'The Front Lines', 'Military Crisis'],
    'LEARNING': ['Knowledge Sought', 'Educational Choice', 'Study Opportunity', 'Academic Challenge', 'Learning Path']
  };
  
  const typeList = titles[scenario.type] || titles['NORMAL'];
  return typeList[Math.floor(Math.random() * typeList.length)];
}

function getScenarioDescription(scenario: ScenarioData): string {
  const descriptions = {
    'NORMAL': 'A situation in daily life that requires a decision',
    'ANIMUS': 'A choice that could affect your soul and magical power',
    'MINDREADING': 'Your mind reading abilities reveal important information',
    'PROPHECY': 'A vision of the future guides your decision',
    'WARS': 'The ongoing conflict presents a difficult choice',
    'LEARNING': 'An opportunity to gain knowledge and wisdom'
  };
  
  return descriptions[scenario.type] || descriptions['NORMAL'];
}

function generateContextualNarrative(scenario: ScenarioData, character: Character, gameData: GameData): string {
  const contextualElements = [
    `As a ${character?.tribe || 'dragon'} dragon, your perspective shapes your approach.`,
    `The atmosphere around you adds tension to the moment.`,
    `Your experiences at ${gameData?.location || 'this place'} influence your decision.`,
    `The weight of your choices so far guides your thinking.`,
    `Your tribal heritage whispers guidance in your mind.`,
    `The memory of past lessons echoes in your thoughts.`,
    `The atmosphere around you seems charged with possibility.`,
    `You feel the eyes of others watching your reaction.`,
    `Your instincts tell you this moment is important.`,
    `The consequences of this choice will ripple outward.`
  ];
  
  return contextualElements[Math.floor(Math.random() * contextualElements.length)];
}

function getRandomTimeOfDay(): string {
  const times = ['dawn', 'morning', 'midday', 'afternoon', 'evening', 'dusk', 'night', 'midnight'];
  return times[Math.floor(Math.random() * times.length)];
}

function getRandomWeather(): string {
  const weather = ['sunny', 'cloudy', 'rainy', 'stormy', 'foggy', 'windy', 'calm', 'overcast'];
  return weather[Math.floor(Math.random() * weather.length)];
}

export function generateTimeInfo(character: Character): string {
  const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
  const times = ['Early morning', 'Mid-morning', 'Late morning', 'Early afternoon', 'Mid-afternoon', 'Late afternoon', 'Early evening', 'Late evening'];
  
  const season = character?.currentSeason || seasons[Math.floor(Math.random() * seasons.length)];
  const time = times[Math.floor(Math.random() * times.length)];
  const year = (character?.yearsSurvived || 0) + 1;
  
  return `${time}, ${season} of Year ${year}`;
}

export function generateLocation(): string {
  const locations = [
    "Jade Mountain Academy",
    "Queen's Palace",
    "Ancient Ruins",
    "Tribal Border",
    "Mysterious Cave",
    "Sacred Grove",
    "War Camp",
    "Peaceful Village",
    "Abandoned Castle",
    "Underground Tunnels",
    "Mountain Peak",
    "Desert Oasis",
    "Coastal Cliffs",
    "Forest Clearing",
    "Ice Palace",
    "Volcano Rim",
    "Hidden Valley",
    "Sky Kingdom",
    "Sea Palace",
    "Mud Kingdom",
    "Sand Kingdom",
    "Night Kingdom",
    "Rain Forest",
    "Frozen Wasteland"
  ];
  
  return locations[Math.floor(Math.random() * locations.length)];
}