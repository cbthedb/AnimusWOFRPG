import { Character, GameData, Scenario, Choice } from "@shared/schema";

interface EnhancedScenarioData {
  id: string;
  type: 'NORMAL' | 'MINDREADING' | 'LEARNING' | 'WARS' | 'ANIMUS' | 'PROPHECY' | 'ROMANCE' | 'FAMILY' | 'ACADEMY' | 'SURVIVAL' | 'POLITICAL';
  title: string;
  setting: string;
  narrativeText: string[];
  emotionalTone: 'tense' | 'peaceful' | 'dramatic' | 'mysterious' | 'romantic' | 'dangerous' | 'enlightening' | 'corrupt';
  requirements?: (character: Character) => boolean;
  contextualModifiers?: (character: Character, gameData: GameData) => string[];
}

// Comprehensive scenario database with rich, immersive content
const ENHANCED_SCENARIO_DATABASE: EnhancedScenarioData[] = [
  // NORMAL - Daily Academy Life & Social Interactions
  {
    id: "mysterious_new_student",
    type: "NORMAL",
    title: "The Mysterious Transfer",
    setting: "Academy Courtyard",
    emotionalTone: "mysterious",
    narrativeText: [
      "A new dragon arrives at Jade Mountain Academy under unusual circumstances. Their scales shimmer with an otherworldly quality, and they seem to avoid eye contact with other students.",
      "As you watch from across the courtyard, you notice they carry no belongings except for a strange pendant that pulses with faint light. Several students whisper nervously as the newcomer passes.",
      "The dragon's presence feels... significant somehow, as if their arrival will change things at the academy."
    ]
  },
  
  {
    id: "forbidden_library_section",
    type: "LEARNING",
    title: "Forbidden Knowledge",
    setting: "Academy Library - Restricted Section",
    emotionalTone: "dangerous",
    narrativeText: [
      "Late at night, you discover a hidden entrance to a forbidden section of the library. Ancient scrolls line the walls, some glowing with magical energy, others bound in chains.",
      "The knowledge here could advance your understanding far beyond your current level, but the warning signs are clear: 'For Senior Students Only' and 'Dangerous Magic - Handle with Extreme Caution.'",
      "You hear footsteps in the distance - someone else is in the library. This could be your only chance to explore these secrets."
    ]
  },

  {
    id: "tribal_festival_invitation",
    type: "NORMAL",
    title: "Cultural Exchange",
    setting: "Jade Mountain Academy - Great Hall",
    emotionalTone: "peaceful",
    narrativeText: [
      "Representatives from the SeaWing kingdom have arrived with an invitation to their annual Luminous Festival, where different tribes gather to share traditions and strengthen alliances.",
      "The festival promises exotic foods, ancient songs, and the opportunity to swim in the legendary Glow Gardens beneath the ocean. However, tensions between certain tribes run high lately.",
      "Your participation could help bridge cultural divides, but it also means leaving the safety of the academy for several days."
    ]
  },

  // ANIMUS - Soul Magic & Corruption
  {
    id: "dying_dragonet_plea",
    type: "ANIMUS",
    title: "Life and Death Magic",
    setting: "Academy Infirmary",
    emotionalTone: "dramatic",
    requirements: (c) => c.isAnimus,
    narrativeText: [
      "A young dragonet lies dying from a rare magical disease that has baffled the healers. Their parent, tears streaming down scaled cheeks, approaches you with desperate hope.",
      "'Please,' they whisper, 'I know what you are. I can see the magic in your eyes. You're the only one who can save my child. I'll give you anything - my treasure, my loyalty, my very life.'",
      "The healing magic required would be complex and costly to your soul, but you possess the power to undo what nature and fate have decided. The dragonet's breathing grows weaker."
    ]
  },

  {
    id: "ancient_animus_artifact",
    type: "ANIMUS", 
    title: "Echoes of Ancient Power",
    setting: "Underground Ruins",
    emotionalTone: "corrupt",
    requirements: (c) => c.isAnimus,
    narrativeText: [
      "Deep beneath the academy, you've discovered ruins containing artifacts left by ancient animus dragons. One item calls to you particularly strongly - a circlet that promises to amplify your magical abilities tenfold.",
      "As you touch the artifact, whispers fill your mind: the voices of animus dragons from centuries past, offering their knowledge and power. But their voices sound... wrong somehow. Hungry. Desperate.",
      "The circlet would make you incredibly powerful, but you sense that it has already consumed many souls before yours. The voices grow more insistent, more seductive."
    ]
  },

  {
    id: "animus_mentor_appearance",
    type: "ANIMUS",
    title: "The Fallen Master",
    setting: "Remote Mountain Cave",
    emotionalTone: "mysterious",
    requirements: (c) => c.isAnimus,
    narrativeText: [
      "A legendary animus dragon, thought long dead, appears before you in a remote cave. Their scales are dulled, their eyes hold depths of ancient pain, but their power still radiates like heat from a forge.",
      "'Young one,' they speak, voice like grinding stone, 'I sense the magic within you. I can teach you secrets that will make you mighty beyond imagination, techniques that have been lost for centuries.'",
      "Their soul is clearly corrupted, perhaps completely, but their knowledge is genuine. They extend a claw, offering to share power that could reshape the world - at a price that has clearly already destroyed them."
    ]
  },

  // MINDREADING - Telepathic Scenarios
  {
    id: "conspiracy_discovery",
    type: "MINDREADING",
    title: "Hidden Betrayal",
    setting: "Academy Council Chambers",
    emotionalTone: "dangerous",
    requirements: (c) => c.tribalPowers.includes('Mind Reading') || c.specialPowers.includes('Enhanced Mind Reading'),
    narrativeText: [
      "While practicing your mind reading abilities, you accidentally penetrate the mental barriers of a trusted academy professor. What you discover chills you to the bone.",
      "They're planning to betray the academy to enemy forces, and they're not working alone. Images of secret meetings, coded messages, and planned attacks flood through their mind.",
      "The professor suddenly turns toward you, their eyes narrowing. Do they know what you've seen? Your continued safety - and that of the entire academy - may depend on your next choice."
    ]
  },

  {
    id: "mental_scream_investigation",
    type: "MINDREADING",
    title: "Silent Scream",
    setting: "Academy Dormitories",
    emotionalTone: "mysterious",
    requirements: (c) => c.tribalPowers.includes('Mind Reading') || c.specialPowers.includes('Enhanced Mind Reading'),
    narrativeText: [
      "In the middle of the night, a piercing mental scream jolts you awake. Someone nearby is experiencing intense fear and pain, but there are no audible sounds of distress.",
      "Using your mind reading abilities, you trace the psychic scream to a fellow student's room. Through the mental connection, you sense they're trapped in a nightmare so vivid it might be magical in nature.",
      "Their terror is so intense it's causing physical harm. You could try to enter their mind to help, but linking with someone in such distress could trap you in the nightmare as well."
    ]
  },

  // PROPHECY - Visions and Fate
  {
    id: "apocalyptic_vision",
    type: "PROPHECY",
    title: "The Coming Storm",
    setting: "Academy Observatory",
    emotionalTone: "dramatic",
    requirements: (c) => c.tribalPowers.includes('Prophecy (rare)') || c.specialPowers.includes('Foresight') || c.specialPowers.includes('Enhanced Prophecy'),
    narrativeText: [
      "While stargazing, a sudden vision overwhelms your senses. You see the academy in flames, students fleeing in terror, and a great shadow falling across all of Pyrrhia.",
      "The vision shows multiple possible futures: in some, you stand among the survivors helping to rebuild. In others, you're nowhere to be seen. In the darkest vision, you're standing with those who caused the destruction.",
      "As the vision fades, you realize it could begin as soon as tomorrow. The choices you make in the coming days will determine which future comes to pass."
    ]
  },

  {
    id: "prophetic_paradox_warning", 
    type: "PROPHECY",
    title: "The Self-Fulfilling Prophecy",
    setting: "Ancient Oracle's Chamber",
    emotionalTone: "mysterious",
    requirements: (c) => c.tribalPowers.includes('Prophecy (rare)') || c.specialPowers.includes('Foresight') || c.specialPowers.includes('Enhanced Prophecy'),
    narrativeText: [
      "A vision reveals that you will cause great harm to someone you care about by trying to prevent exactly that harm from occurring. The more you try to change the future, the more likely it becomes.",
      "The prophecy is specific: your attempts to save them will be what dooms them. Yet doing nothing while knowing this fate seems equally impossible.",
      "Ancient texts speak of prophetic paradoxes like this - visions that trap the seer in an endless loop of cause and effect. The only escape may be to find a third path entirely."
    ]
  },

  // WARS - Conflict and Military
  {
    id: "war_refugee_crisis",
    type: "WARS",
    title: "Displaced and Desperate",
    setting: "Academy Gates",
    emotionalTone: "dramatic",
    narrativeText: [
      "Hundreds of war refugees have arrived at the academy seeking shelter. Among them are injured soldiers, terrified dragonets, and elderly dragons who've lost everything to the conflict.",
      "The academy's resources are already stretched thin, and housing this many refugees would mean rationing food and overcrowding. Some argue that helping them makes the academy a target for military action.",
      "You notice several of the refugees have suspicious injuries - not from battle, but from torture. These aren't just civilians caught in crossfire; they're escaped prisoners with valuable intelligence."
    ]
  },

  {
    id: "commander_war_crimes",
    type: "WARS", 
    title: "Orders from Above",
    setting: "Military Command Tent",
    emotionalTone: "tense",
    narrativeText: [
      "Your commanding officer orders you to execute prisoners of war, claiming they're too dangerous to keep alive and resources are too scarce to maintain them.",
      "The prisoners are young soldiers, barely older than academy students. They surrender weapons, showing no signs of continued resistance, and plead for their lives in broken Dragon Common.",
      "Other soldiers around you are watching to see what you'll do. Your choice here will define not only who you are, but how others see you for the rest of this war."
    ]
  },

  // ROMANCE - Relationships and Love
  {
    id: "forbidden_cross_tribal_love",
    type: "ROMANCE",
    title: "Love Across Enemy Lines",
    setting: "Secret Meeting Place - Border Cave",
    emotionalTone: "romantic",
    narrativeText: [
      "You've been secretly meeting with a dragon from a tribe currently at war with yours. What began as curiosity about the 'enemy' has blossomed into deep, genuine love.",
      "Tonight they confess their feelings match yours, but also reveal devastating news: their tribe is planning a major attack on your home territory. They could provide you with details that might save hundreds of lives.",
      "But using this information would certainly expose your relationship and brand you both as traitors. Choosing love might mean choosing to let innocents die."
    ]
  },

  {
    id: "mate_selection_pressure", 
    type: "ROMANCE",
    title: "Arranged Futures",
    setting: "Royal Palace - Throne Room",
    emotionalTone: "tense",
    requirements: (c) => c.age >= 7,
    narrativeText: [
      "Your family has arranged a mating with another dragon to strengthen political alliances. They're attractive, intelligent, and kind - a perfect match on paper.",
      "However, your heart belongs to another, someone your family would never approve of. The arranged mating ceremony is set for next month, and backing out would bring shame to your entire bloodline.",
      "Your intended mate pulls you aside and confesses they're in a similar situation - they love someone else too. Together, you might be able to find a solution that satisfies everyone, or risk everything for true love."
    ]
  },

  // FAMILY - Legacy and Generations
  {
    id: "dragonet_first_flight",
    type: "FAMILY",
    title: "Learning to Soar",
    setting: "Mountain Cliffs - Flying Training Grounds",
    emotionalTone: "peaceful",
    requirements: (c) => c.dragonets.length > 0,
    narrativeText: [
      "Your dragonet is ready for their first real flight beyond the safety of the training grounds. Their wings are strong, but the mountain winds are treacherous for inexperienced fliers.",
      "They're eager to prove themselves, perhaps too eager. You see them eyeing the most challenging flight path - a route through narrow canyon passages that even some adults avoid.",
      "How you handle this milestone will shape not only their confidence as a flier, but their approach to risk and challenges throughout their life."
    ],
    contextualModifiers: (character, gameData) => {
      const dragonet = character.dragonets[0];
      if (dragonet) {
        return [`Your dragonet ${dragonet.name} looks up at you with eager, trusting eyes.`];
      }
      return [];
    }
  },

  // ACADEMY - School Life and Learning  
  {
    id: "cheating_scandal",
    type: "ACADEMY",
    title: "Academic Dishonesty",
    setting: "Academy Classroom",
    emotionalTone: "tense",
    narrativeText: [
      "During a crucial examination that will determine class rankings, you notice your closest friend cheating. They're using hidden notes and magical enhancements to gain an unfair advantage.",
      "This friend has been struggling academically and has confided their fear of being expelled if their grades don't improve. Their entire future depends on passing this test.",
      "The professor hasn't noticed yet, but other students are starting to whisper. Your response will affect not only your friend's fate, but also how the entire class views academic integrity."
    ]
  },

  {
    id: "dangerous_experiment_proposal",
    type: "LEARNING",
    title: "Pushing Boundaries",
    setting: "Academy Laboratory",
    emotionalTone: "dangerous",
    narrativeText: [
      "A brilliant but reckless professor offers you the chance to participate in an experimental procedure that could unlock new magical abilities. The potential benefits are enormous.",
      "However, the last three volunteers for similar experiments suffered permanent magical damage. One lost their voice, another can no longer fly, and the third has episodes where they completely lose control of their powers.",
      "The professor insists they've solved the problems from previous attempts, but their excitement seems to outweigh their caution. They need one more volunteer to complete their research."
    ]
  },

  // SURVIVAL - Life and Death Situations
  {
    id: "avalanche_rescue_mission",
    type: "SURVIVAL", 
    title: "Buried Alive",
    setting: "Frozen Mountain Pass",
    emotionalTone: "dangerous",
    narrativeText: [
      "An avalanche has buried a group of traveling merchants. You can hear faint calls for help from beneath tons of snow and ice, but the unstable conditions mean another avalanche could happen at any moment.",
      "You have enough magical or physical strength to attempt a rescue, but it would require putting yourself in extreme danger. The local weather patterns suggest you have minutes, not hours.",
      "Your companions urge you to wait for professional rescue teams, but those calls for help are growing weaker. By the time help arrives, it may be too late."
    ]
  },

  // POLITICAL - Intrigue and Power
  {
    id: "succession_crisis_involvement",
    type: "POLITICAL",
    title: "The Crown's Weight", 
    setting: "Royal Court - Secret Meeting Chamber",
    emotionalTone: "tense",
    narrativeText: [
      "A succession crisis threatens to tear the kingdom apart as two equally valid heirs claim the throne. Each faction approaches you, seeking your support for their candidate.",
      "One heir promises progressive reforms and peace with neighboring kingdoms, but lacks military experience. The other is a proven warrior who could ensure stability, but tends toward authoritarian rule.",
      "Your choice could tip the balance of power and determine the future of thousands of dragons. Both sides have made it clear that neutrality is not an option - you must choose."
    ]
  },

  // More ANIMUS Scenarios based on attached files
  {
    id: "animus_power_discovery",
    type: "ANIMUS",
    title: "The First Spark",
    setting: "Academy Training Grounds - Combat Practice",
    emotionalTone: "dramatic",
    requirements: (c) => c.isAnimus,
    narrativeText: [
      "During a particularly intense combat training session, your emotions surge beyond your control. Suddenly, your opponent's training weapon transforms into a harmless flower in their claws.",
      "The entire training ground falls silent as every eye turns to you. You've just discovered your animus power for the first time, and you did it in front of witnesses.",
      "Some dragons step back in fear, others whisper in awe, and your instructor's expression is unreadable. The secret you never knew you carried is now exposed for all to see."
    ]
  },

  {
    id: "animus_power_backfire",
    type: "ANIMUS", 
    title: "Magic Gone Wrong",
    setting: "Academy Dormitory - Your Room",
    emotionalTone: "dangerous",
    requirements: (c) => c.isAnimus,
    narrativeText: [
      "While attempting a simple enchantment to organize your belongings, your animus power suddenly surges out of control. Books burst into flames, furniture begins growing like plants, and your mirror starts showing other dragons' reflections.",
      "The magic continues to cascade unpredictably, affecting everything you touch. Other students are starting to notice the strange sounds and lights coming from your room.",
      "You need to regain control quickly, but panic is making your power even more unstable. Each attempt to fix one problem creates two more."
    ]
  },

  {
    id: "enchanted_object_request",
    type: "ANIMUS",
    title: "The Desperate Request",
    setting: "Academy Gardens - Secluded Grove", 
    emotionalTone: "dramatic",
    requirements: (c) => c.isAnimus,
    narrativeText: [
      "An older dragon approaches you in desperation, having somehow discovered your animus abilities. Their dragonet is trapped in an enchanted sleep, cursed by another animus dragon years ago.",
      "'I've spent everything I have seeking a cure,' they plead, tears streaming down their weathered scales. 'You're my last hope. Please, I'll give you my life savings, my loyalty, anything.'",
      "The enchantment keeping their child asleep is complex and powerful. Breaking it would require significant magical effort and cost to your soul, but you have the power to reunite this family."
    ]
  },

  {
    id: "animus_council_invitation",
    type: "ANIMUS",
    title: "The Hidden Gathering", 
    setting: "Underground Chamber - Secret Location",
    emotionalTone: "mysterious",
    requirements: (c) => c.isAnimus,
    narrativeText: [
      "A mysterious message appears in your room, written in ancient dragonic script that glows faintly with magic. It's an invitation to join a secret council of animus dragons.",
      "The message reveals that there are more animus dragons than you ever imagined, operating in secret throughout Pyrrhia. They claim to be working together to use their powers responsibly and protect each other from persecution.",
      "The meeting location is provided, along with a warning: 'Come alone, tell no one, and be prepared to commit to something greater than yourself.' The message self-destructs after you finish reading."
    ]
  },

  {
    id: "magical_plague_crisis",
    type: "ANIMUS",
    title: "The Spreading Curse", 
    setting: "Affected Village - Medical Tent",
    emotionalTone: "dangerous",
    requirements: (c) => c.isAnimus,
    narrativeText: [
      "A magical plague is spreading through a nearby village, turning dragons to stone one by one. The local healers are powerless against this curse, and the death toll rises daily.",
      "You've determined that only animus magic can break the curse, but the scale of the enchantment required would be enormous. You'd need to risk a significant portion of your soul to save hundreds of lives.",
      "As you stand among the affected dragons, some still partially transformed with terror frozen in their stone features, you realize that time is running out. The curse spreads faster each day."
    ]
  },

  // More MINDREADING Scenarios
  {
    id: "mind_reading_addiction",
    type: "MINDREADING",
    title: "The Addiction",
    setting: "Academy Cafeteria - Crowded Social Space", 
    emotionalTone: "corrupt",
    requirements: (c) => c.tribalPowers.includes('Mind Reading') || c.specialPowers.includes('Enhanced Mind Reading'),
    narrativeText: [
      "You've found yourself unable to stop reading other dragons' minds. What started as curiosity has become a compulsion that grows stronger each day.",
      "Every conversation feels hollow because you know exactly what everyone is really thinking. You've learned secrets that no one intended to share, and the constant stream of thoughts is beginning to overwhelm your own identity.",
      "Today you realized that you've been unconsciously influencing others' thoughts, subtly pushing them toward decisions that benefit you. The line between reading minds and controlling them is becoming dangerously blurred."
    ]
  },

  {
    id: "psychic_scream_crisis",
    type: "MINDREADING",
    title: "The Silent Victim",
    setting: "Academy Medical Wing - Emergency Ward",
    emotionalTone: "dramatic", 
    requirements: (c) => c.tribalPowers.includes('Mind Reading') || c.specialPowers.includes('Enhanced Mind Reading'),
    narrativeText: [
      "A piercing psychic scream jolts you awake in the middle of the night, so intense it leaves you gasping. Someone nearby is experiencing tremendous mental anguish, but their physical body shows no signs of distress.",
      "Following the psychic signature, you find a fellow student apparently sleeping peacefully. However, their mind is trapped in a nightmare so vivid and terrifying that it's causing real psychological damage.",
      "The nightmare seems to be magical in nature, possibly planted by someone else. If you don't intervene, the victim may never wake up - but entering their mind could trap you in the nightmare as well."
    ]
  },

  {
    id: "mental_link_invitation",
    type: "MINDREADING",
    title: "The Offered Connection",
    setting: "Academy Library - Telepathy Study Section",
    emotionalTone: "mysterious",
    requirements: (c) => c.tribalPowers.includes('Mind Reading') || c.specialPowers.includes('Enhanced Mind Reading'),
    narrativeText: [
      "While studying telepathy techniques, another mind reader approaches you with an unusual proposal. They offer to establish a permanent mental link between you, allowing instant communication and shared thoughts.",
      "They explain that such links can enhance both dragons' abilities and provide emotional support during difficult times. However, permanent mind links also mean no privacy - you would share not just thoughts, but emotions and memories.",
      "The other dragon seems sincere and their offer is tempting, especially given the isolation that comes with mind reading abilities. But such an intimate connection could also be used to manipulate or control."
    ]
  },

  // More PROPHECY Scenarios
  {
    id: "prophetic_vision_disaster",
    type: "PROPHECY",
    title: "The Coming Catastrophe",
    setting: "Academy Observatory - Stargazing Platform",
    emotionalTone: "dramatic",
    requirements: (c) => c.tribalPowers.includes('Prophecy (rare)') || c.specialPowers.includes('Foresight') || c.specialPowers.includes('Enhanced Prophecy'),
    narrativeText: [
      "While studying the ancient star charts, a sudden vision overwhelms your senses. You see the academy consumed by an unnatural fire that burns cold instead of hot, turning everything it touches to ice.",
      "In the vision, dragons flee screaming as their wings freeze solid and shatter. You see specific details: the time (tomorrow at sunset), the source (the academy's magical heating system), and the trigger (a seemingly minor maintenance error).",
      "The vision is remarkably clear and detailed, suggesting it's a near-certain future rather than just a possibility. You have less than a day to either prevent this catastrophe or evacuate the academy."
    ]
  },

  {
    id: "prophecy_paradox_trap",
    type: "PROPHECY",
    title: "The Impossible Choice",
    setting: "Sacred Oracle Chamber - Ancient Temple",
    emotionalTone: "mysterious",
    requirements: (c) => c.tribalPowers.includes('Prophecy (rare)') || c.specialPowers.includes('Foresight') || c.specialPowers.includes('Enhanced Prophecy'),
    narrativeText: [
      "A vision shows you that your best friend will die tomorrow because of actions you will take to save them. Every path you see where you try to prevent their death actually causes it through increasingly complex chains of causation.",
      "The prophecy is maddeningly specific: if you warn them, they'll panic and make a fatal mistake. If you try to keep them safe, your protection will put them in danger. If you do nothing, they die anyway.",
      "Ancient texts speak of 'paradox prophecies' - visions that trap the seer in a loop where knowledge of the future creates the very future they're trying to prevent. Breaking free requires finding a path the prophecy didn't show you."
    ]
  },

  {
    id: "shared_prophetic_burden", 
    type: "PROPHECY",
    title: "The Shared Vision",
    setting: "Academy Meditation Gardens - Circle of Stones",
    emotionalTone: "enlightening",
    requirements: (c) => c.tribalPowers.includes('Prophecy (rare)') || c.specialPowers.includes('Foresight') || c.specialPowers.includes('Enhanced Prophecy'),
    narrativeText: [
      "During a group meditation session, you suddenly realize that another dragon is experiencing the exact same prophetic vision as you. This has never happened before - prophecy is typically a solitary burden.",
      "The shared vision shows a great war coming to Pyrrhia, but having two prophetic perspectives reveals details that neither of you could see alone. Together, you might be able to understand how to prevent the conflict.",
      "However, sharing prophetic visions is considered impossible by most scholars. Either you're witnessing something unprecedented, or one of you isn't what they seem to be."
    ]
  },

  // More WARS Scenarios
  {
    id: "civilian_evacuation_choice",
    type: "WARS",
    title: "The Evacuation Dilemma",
    setting: "Border Town - Emergency Command Center",
    emotionalTone: "tense",
    narrativeText: [
      "Enemy forces are advancing faster than expected, and you're in charge of evacuating a border town. However, there are too many civilians and not enough transport - you can't save everyone.",
      "Military strategists advise prioritizing essential personnel and young dragons who can help rebuild. However, abandoning the elderly and disabled to enemy forces goes against everything you believe in.",
      "Time is running out. The enemy will arrive within hours, and every minute spent on moral deliberation is a minute lost that could be used for evacuation. The town's survival depends on making hard choices."
    ]
  },

  {
    id: "prisoner_of_war_interrogation",
    type: "WARS",
    title: "Information at Any Cost",
    setting: "Military Detention Facility - Interrogation Room",
    emotionalTone: "corrupt",
    narrativeText: [
      "You've captured an enemy officer who possesses critical intelligence about a planned attack on civilian targets. Standard interrogation methods have failed, and your commanders are pressuring you to use more... persuasive techniques.",
      "The prisoner is young, frightened, and clearly reluctant to betray their comrades. However, the information they possess could save hundreds of innocent lives if an attack proceeds as planned.",
      "Your commanders have made it clear that 'results matter more than methods' in this case. The tools for enhanced interrogation are readily available, and turning a blind eye to their use would be easy."
    ]
  },

  {
    id: "false_flag_operation",
    type: "WARS", 
    title: "The Deceptive Strike",
    setting: "Military Command Tent - Strategy Meeting",
    emotionalTone: "corrupt",
    narrativeText: [
      "Your military commanders propose a false flag operation: attacking your own allies while disguised as enemy forces, then using the incident to justify a massive retaliation that would end the war quickly.",
      "The plan is militarily sound and would likely succeed in its goals, potentially saving thousands of lives in the long run by shortening the conflict. However, it involves betraying allies and lying to your own people.",
      "You've been selected for this mission because of your proven abilities and discretion. Refusing could be seen as insubordination, but participating means becoming complicit in a conspiracy that violates every principle of honorable warfare."
    ]
  },

  // More SURVIVAL Scenarios
  {
    id: "poisoned_water_supply",
    type: "SURVIVAL",
    title: "Toxic Waters",
    setting: "Mountain Wilderness - Contaminated Stream",
    emotionalTone: "dangerous",
    narrativeText: [
      "During a wilderness expedition, your group discovers that the only water source for miles has been contaminated with a magical poison. Several dragons are already showing signs of sickness.",
      "You have enough clean water for maybe one more day, and the nearest alternative source is a three-day journey through hostile territory. Some of the group are too sick to travel far.",
      "However, you've identified a magical plant nearby that could neutralize the poison in the water. The problem is that harvesting it requires someone to expose themselves to concentrated toxins that could prove fatal."
    ]
  },

  {
    id: "avalanche_rescue_dilemma", 
    type: "SURVIVAL",
    title: "Buried Alive",
    setting: "Frozen Mountain Pass - Avalanche Site",
    emotionalTone: "dramatic",
    narrativeText: [
      "An avalanche has buried a merchant caravan, and you can hear faint calls for help from beneath tons of snow and ice. However, the conditions remain unstable - another avalanche could happen at any moment.",
      "Your party has the strength and tools to attempt a rescue, but it would require everyone to work in the danger zone for hours. The alternative is to wait for professional rescue teams that might not arrive in time.",
      "As you debate, the calls for help grow weaker. Among the buried are several dragonets whose voices you can clearly identify. Time is running out, and every moment of hesitation makes survival less likely."
    ]
  },

  // More ACADEMY Scenarios
  {
    id: "academic_cheating_scandal",
    type: "ACADEMY",
    title: "The Honor Code Crisis", 
    setting: "Academy Testing Hall - Final Examinations",
    emotionalTone: "tense",
    narrativeText: [
      "During the most important examination of the year, you discover that several students are using sophisticated magical cheating methods. These aren't simple note-hiding tricks, but complex enchantments that give them access to vast amounts of knowledge.",
      "The cheating is so advanced that it's clearly being organized by someone with significant magical skills - possibly even a faculty member. The students involved include some of your closest friends.",
      "Your own academic standing depends partly on class rankings, and these cheaters are artificially inflating their scores at the expense of honest students. Reporting them might save the integrity of the system but could destroy friendships and potentially someone's entire future."
    ]
  },

  {
    id: "dangerous_magical_experiment",
    type: "LEARNING", 
    title: "The Forbidden Research",
    setting: "Academy Laboratory - Advanced Magic Wing",
    emotionalTone: "dangerous",
    narrativeText: [
      "A brilliant but reckless professor offers you the chance to participate in experimental research that could revolutionize magical understanding. The potential discoveries could benefit all of dragonkind.",
      "However, the previous volunteers for similar experiments suffered severe consequences: one lost their ability to breathe fire permanently, another developed uncontrollable magic surges, and a third disappeared entirely during the procedure.",
      "The professor insists they've refined the technique and eliminated the dangers, but their excitement seems to override their caution. They need one more volunteer to complete the research and publish results that could change history."
    ]
  },

  // ROMANCE Scenarios
  {
    id: "arranged_mating_conflict",
    type: "ROMANCE",
    title: "Duty Versus Heart", 
    setting: "Family Estate - Formal Gardens",
    emotionalTone: "romantic",
    requirements: (c) => c.age >= 6,
    narrativeText: [
      "Your family has arranged a prestigious mating that would strengthen important political alliances and secure your family's future. Your intended partner is everything anyone could ask for - attractive, intelligent, wealthy, and kind.",
      "The problem is that your heart belongs to someone else entirely: a dragon from a lower social class whom your family would never accept. The love between you is genuine and deep, but pursuing it would mean sacrificing your family's honor and expectations.",
      "The arranged mating ceremony is scheduled for next month, and your intended partner has begun making plans for your shared future together. They seem genuinely happy about the arrangement, which makes the situation even more complicated."
    ]
  },

  {
    id: "secret_cross_tribal_romance",
    type: "ROMANCE",
    title: "Love Across Enemy Lines",
    setting: "Neutral Territory - Hidden Cave",
    emotionalTone: "romantic",
    requirements: (c) => c.age >= 5,
    narrativeText: [
      "For months, you've been secretly meeting with a dragon from a tribe currently at war with yours. What began as curiosity about the 'enemy' has evolved into deep, genuine love that transcends tribal boundaries.",
      "Tonight, your beloved reveals critical information about their tribe's military plans - including a surprise attack on your home territory that could result in massive casualties. They're sharing this information because they trust you completely.",
      "However, using this intelligence would certainly expose your relationship and brand both of you as traitors to your respective tribes. The choice is between protecting hundreds of innocent lives and protecting the dragon you love more than life itself."
    ]
  },

  // SOUL/SANITY RESTORATION Scenarios - Designed to work with regeneration system
  {
    id: "helping_injured_dragonet",
    type: "NORMAL",
    title: "A Cry for Help",
    setting: "Academy Courtyard",
    emotionalTone: "peaceful",
    narrativeText: [
      "A young dragonet has fallen from the sky during flight practice, landing hard and crying from both pain and embarrassment. Other students walk past, some snickering at the obvious failure.",
      "The dragonet's wing is clearly injured, and they're too proud to ask for help directly. Their instructor is nowhere to be seen, and the medical wing is across the academy.",
      "This small act of kindness could make a real difference in this young dragon's life, and sometimes the smallest gestures restore our faith in ourselves."
    ]
  },

  {
    id: "meditation_and_reflection",
    type: "NORMAL",
    title: "Peaceful Contemplation",
    setting: "Academy Meditation Gardens",
    emotionalTone: "peaceful",
    narrativeText: [
      "The gardens offer a rare moment of tranquility away from the pressures of academy life. Ancient stone benches sit among flowering vines, and the sound of flowing water creates perfect serenity.",
      "You feel the weight of recent choices and the toll they've taken on your spirit. This sacred space seems to offer the opportunity for true reflection and inner peace.",
      "Sometimes taking time to center yourself and reconnect with your true nature is the most important choice you can make."
    ]
  },

  {
    id: "defending_the_innocent",
    type: "NORMAL",
    title: "Standing for Justice",
    setting: "Village Market - Public Square",
    emotionalTone: "enlightening",
    narrativeText: [
      "A group of older dragons are bullying a young merchant, threatening to destroy their stall unless they pay 'protection' money. The merchant is clearly terrified and can't afford what they're demanding.",
      "Other bystanders pretend not to notice, unwilling to get involved. The bullies are clearly counting on this cowardice to continue their behavior.",
      "This is a moment where taking a stand could make a real difference, and acting with courage and compassion often strengthens the soul rather than weakening it."
    ]
  },

  {
    id: "sharing_wisdom_teaching",
    type: "LEARNING", 
    title: "The Gift of Knowledge",
    setting: "Academy Library - Study Hall",
    emotionalTone: "enlightening",
    narrativeText: [
      "A younger student approaches you, struggling with concepts you've already mastered. They're clearly frustrated and on the verge of giving up entirely.",
      "Teaching others and sharing knowledge freely is one of the most noble uses of wisdom. This student could truly benefit from your guidance.",
      "Sometimes helping others learn and grow gives us as much as it gives them, restoring our sense of purpose and connection."
    ]
  },

  {
    id: "forgiveness_and_mercy",
    type: "NORMAL",
    title: "The Power of Forgiveness",
    setting: "Academy Dormitories",
    emotionalTone: "enlightening", 
    narrativeText: [
      "A dragon who has wronged you in the past approaches with genuine remorse, seeking forgiveness for their actions. Their apology seems heartfelt and sincere.",
      "Holding onto anger and resentment has been weighing on your spirit. This could be an opportunity to let go of past hurts and find peace.",
      "Forgiveness often heals the one who forgives even more than the one being forgiven, offering a path back to inner harmony."
    ]
  },

  // FAMILY Scenarios  
  {
    id: "dragonet_magical_awakening",
    type: "FAMILY",
    title: "Inherited Power",
    setting: "Family Dwelling - Private Chambers",
    emotionalTone: "dramatic",
    requirements: (c) => c.dragonets.length > 0,
    narrativeText: [
      "Your dragonet has just manifested powerful magical abilities far beyond what's normal for their age. Objects around them float without conscious control, and their emotions seem to affect the weather outside.",
      "This level of magical power in one so young is unprecedented and potentially dangerous. They could hurt themselves or others without proper training, but taking them to magical authorities might result in them being taken away for 'special education.'",
      "The dragonet is frightened by their new abilities and looks to you for guidance and protection. How you handle this awakening will shape not only their relationship with magic, but their trust in you as their parent."
    ],
    contextualModifiers: (character, gameData) => {
      const dragonet = character.dragonets[0];
      if (dragonet) {
        return [`${dragonet.name} clings to your wing, tears streaming down their small face as another flower pot floats past the window.`];
      }
      return [];
    }
  },

  {
    id: "teaching_dragonet_values", 
    type: "FAMILY",
    title: "The Moral Lesson",
    setting: "Academy Grounds - Walking Path",
    emotionalTone: "peaceful",
    requirements: (c) => c.dragonets.length > 0,
    narrativeText: [
      "While walking with your dragonet, you witness another young dragon being bullied by a group of older students. Your dragonet looks up at you expectantly, waiting to see how you'll respond to this injustice.",
      "This is clearly a teachable moment about standing up for others, but intervening could put both you and your dragonet in conflict with some powerful families whose children are involved in the bullying.",
      "Your dragonet is at an age where they're forming their core values based on your example. Whatever you do in this moment will likely influence how they approach similar situations throughout their life."
    ],
    contextualModifiers: (character, gameData) => {
      const dragonet = character.dragonets[0];
      if (dragonet) {
        return [`${dragonet.name} tugs on your wing and whispers, "Shouldn't we help them, parent?"`];
      }
      return [];
    }
  }
];

// Enhanced choice generation with more variety and depth
function generateEnhancedChoices(scenario: EnhancedScenarioData, character: Character): Choice[] {
  const choices: Choice[] = [];
  
  // Generate scenario-specific choices based on type and context
  switch (scenario.type) {
    case 'ANIMUS':
      choices.push(
        {
          id: `${scenario.id}_use_magic_carefully`,
          text: "Use your animus powers carefully",
          description: "Channel magic with restraint and precision",
          soulCost: 8,
          sanityCost: 2,
          consequences: ["You draw upon your animus magic, feeling your soul dim slightly as power flows through you..."]
        },
        {
          id: `${scenario.id}_use_magic_recklessly`, 
          text: "Unleash your full magical power",
          description: "Don't hold back - use whatever force is necessary",
          soulCost: 15,
          sanityCost: 0,
          consequences: ["Power surges through you like wildfire, solving the problem instantly but leaving you feeling... different..."],
          corruption: true
        },
        {
          id: `${scenario.id}_resist_temptation`,
          text: "Resist using magic",
          description: "Find another way without relying on animus power", 
          soulCost: 0,
          sanityCost: 8,
          consequences: ["You steel yourself against the easy solution, preserving your soul but making things much harder..."]
        }
      );
      break;

    case 'MINDREADING':
      choices.push(
        {
          id: `${scenario.id}_read_mind_carefully`,
          text: "Probe their thoughts carefully",
          description: "Use your abilities with surgical precision",
          soulCost: 2,
          sanityCost: 3,
          consequences: ["You delicately touch the surface of their mind, gathering information without causing harm..."]
        },
        {
          id: `${scenario.id}_mental_invasion`,
          text: "Force your way into their mind", 
          description: "Break through their mental defenses completely",
          soulCost: 6,
          sanityCost: 1,
          consequences: ["You smash through their mental barriers like a battering ram, taking what you need by force..."],
          corruption: true
        },
        {
          id: `${scenario.id}_respect_privacy`,
          text: "Respect their mental privacy",
          description: "Don't use your powers on them",
          soulCost: 0,
          sanityCost: 5,
          consequences: ["You turn away from the easy path of mental intrusion, choosing to respect their privacy..."]
        }
      );
      break;

    case 'WARS':
      choices.push(
        {
          id: `${scenario.id}_fight_honorably`,
          text: "Fight with honor",
          description: "Engage according to warrior's code",
          soulCost: 0,
          sanityCost: 5,
          consequences: ["You choose the path of honor, even when it makes victory harder to achieve..."]
        },
        {
          id: `${scenario.id}_fight_ruthlessly`,
          text: "Fight without mercy",
          description: "Victory at any cost",
          soulCost: 8,
          sanityCost: 2,
          consequences: ["You push aside concerns about honor and morality, focused only on winning..."],
          corruption: true
        },
        {
          id: `${scenario.id}_seek_peace`,
          text: "Attempt negotiation",
          description: "Try to find a peaceful solution",
          soulCost: 0,
          sanityCost: 8,
          consequences: ["You extend a claw in peace, hoping that reason can prevail over violence..."]
        },
        {
          id: `${scenario.id}_strategic_retreat`,
          text: "Tactical withdrawal", 
          description: "Live to fight another day when conditions are better",
          soulCost: 0,
          sanityCost: 10,
          consequences: ["Sometimes wisdom means knowing when not to fight..."]
        }
      );
      break;

    case 'ROMANCE':
      choices.push(
        {
          id: `${scenario.id}_follow_heart`,
          text: "Follow your heart",
          description: "Choose love despite the consequences",
          soulCost: 0,
          sanityCost: 12,
          consequences: ["You choose the path of true love, accepting whatever challenges come with it..."]
        },
        {
          id: `${scenario.id}_practical_choice`,
          text: "Make the practical choice",
          description: "Choose what makes sense over what feels right",
          soulCost: 3,
          sanityCost: 5,
          consequences: ["You set aside your heart's desires for what logic dictates is best..."]
        },
        {
          id: `${scenario.id}_delay_decision`,
          text: "Ask for more time",
          description: "Try to find a way to have both love and duty",
          soulCost: 0,
          sanityCost: 8,
          consequences: ["You request time to find a solution that honors both your heart and your obligations..."]
        }
      );
      break;

    default:
      // Generate choices based on scenario content and emotional tone
      if (scenario.emotionalTone === 'peaceful' || scenario.emotionalTone === 'enlightening') {
        // Scenarios that can restore soul/sanity
        choices.push(
          {
            id: `${scenario.id}_compassionate_action`,
            text: "Act with compassion and kindness",
            description: "Choose the path that helps others",
            soulCost: 0,
            sanityCost: -2, // Restores sanity
            consequences: ["Your compassionate choice lifts your spirits and restores inner peace..."]
          },
          {
            id: `${scenario.id}_wise_approach`,
            text: "Apply wisdom and patience",
            description: "Take time to make the most thoughtful choice",
            soulCost: 0,
            sanityCost: -1, // Restores sanity slightly
            consequences: ["Your thoughtful approach brings clarity and peace of mind..."]
          },
          {
            id: `${scenario.id}_selfless_help`,
            text: "Put others' needs before your own",
            description: "Make a sacrifice to help someone else",
            soulCost: 0,
            sanityCost: 3,
            consequences: ["Your selfless action strengthens your soul even as it challenges you..."]
          }
        );
      } else {
        // Standard choices for other tones
        choices.push(
          {
            id: `${scenario.id}_bold_action`,
            text: "Take bold action",
            description: "Act decisively and confidently", 
            soulCost: 0,
            sanityCost: 4,
            consequences: ["You act with confidence and determination..."]
          },
          {
            id: `${scenario.id}_cautious_approach`,
            text: "Proceed cautiously",
            description: "Think carefully before acting",
            soulCost: 0,
            sanityCost: 2,
            consequences: ["You take time to consider all angles before making your move..."]
          },
          {
            id: `${scenario.id}_seek_help`,
            text: "Seek advice from others",
            description: "Consult with friends or mentors",
            soulCost: 0,
            sanityCost: 6,
            consequences: ["You decide this decision is too important to make alone..."]
          },
          {
            id: `${scenario.id}_avoid_involvement`,
            text: "Avoid getting involved",
            description: "Step back and let others handle it",
            soulCost: 2,
            sanityCost: 8,
            consequences: ["You choose not to get involved, letting events unfold without your influence..."]
          }
        );
      }
      break;
  }

  // Add contextual choices based on character abilities
  if (character.isAnimus && scenario.type !== 'ANIMUS') {
    choices.push({
      id: `${scenario.id}_animus_solution`,
      text: "Use animus magic to solve this",
      description: "Apply magical power to cut through the complications",
      soulCost: 12,
      sanityCost: 0,
      consequences: ["Your animus magic provides an elegant solution, though you feel the familiar cost to your soul..."]
    });
  }

  return choices;
}

// Enhanced scenario generation with better filtering and variety
export function generateEnhancedScenario(character: Character, gameData: GameData): Scenario {
  // Filter scenarios based on character abilities and age
  const availableScenarios = ENHANCED_SCENARIO_DATABASE.filter(scenario => {
    // Apply requirements filter
    if (scenario.requirements && !scenario.requirements(character)) {
      return false;
    }
    
    // Enhanced filtering for power-specific scenarios  
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
    if (scenario.type === 'FAMILY' && character.dragonets.length === 0) {
      return false;
    }
    if (scenario.type === 'ROMANCE' && (character.age < 3 || character.soulPercentage < 50 || character.sanityPercentage < 50)) {
      return false;
    }
    
    return true;
  });

  if (availableScenarios.length === 0) {
    // Fallback to basic scenarios if none available
    const fallbackScenario = ENHANCED_SCENARIO_DATABASE.find(s => s.type === 'NORMAL') || ENHANCED_SCENARIO_DATABASE[0];
    return convertToScenario(fallbackScenario, character, gameData);
  }

  // Weight scenarios based on recent history to avoid repetition
  const weightedScenarios = weightScenariosByHistory(availableScenarios, gameData);
  const selectedScenario = selectWeightedScenario(weightedScenarios);
  
  return convertToScenario(selectedScenario, character, gameData);
}

function weightScenariosByHistory(scenarios: EnhancedScenarioData[], gameData: GameData): { scenario: EnhancedScenarioData; weight: number }[] {
  const recentScenarioTypes = gameData.history
    .slice(-5) // Last 5 turns
    .map(event => event.scenario.split('_')[0]); // Extract scenario type
  
  return scenarios.map(scenario => {
    let weight = 1.0;
    
    // Reduce weight for recently used scenario types
    const typeUsageCount = recentScenarioTypes.filter(type => 
      scenario.id.startsWith(type)
    ).length;
    weight -= (typeUsageCount * 0.3);
    
    // Increase weight for scenarios that haven't been used recently
    if (!recentScenarioTypes.some(type => scenario.id.startsWith(type))) {
      weight += 0.5;
    }
    
    return { scenario, weight: Math.max(0.1, weight) };
  });
}

function selectWeightedScenario(weightedScenarios: { scenario: EnhancedScenarioData; weight: number }[]): EnhancedScenarioData {
  const totalWeight = weightedScenarios.reduce((sum, item) => sum + item.weight, 0);
  let randomValue = Math.random() * totalWeight;
  
  for (const item of weightedScenarios) {
    randomValue -= item.weight;
    if (randomValue <= 0) {
      return item.scenario;
    }
  }
  
  return weightedScenarios[0].scenario; // Fallback
}

function convertToScenario(scenarioData: EnhancedScenarioData, character: Character, gameData: GameData): Scenario {
  const contextualText = scenarioData.contextualModifiers 
    ? scenarioData.contextualModifiers(character, gameData)
    : [];
  
  const fullNarrativeText = [
    ...scenarioData.narrativeText,
    ...contextualText,
    generateAtmosphericText(scenarioData.setting, scenarioData.emotionalTone)
  ];

  // Determine game type for engine
  let gameType: 'mundane' | 'extraordinary' | 'magical' | 'tribal' | 'prophetic' = 'mundane';
  switch (scenarioData.type) {
    case 'ANIMUS':
      gameType = 'magical';
      break;
    case 'WARS':
    case 'SURVIVAL':
    case 'POLITICAL':
      gameType = 'extraordinary';
      break;
    case 'PROPHECY':
      gameType = 'prophetic';
      break;
    case 'MINDREADING':
      gameType = 'tribal';
      break;
    case 'LEARNING':
    case 'ACADEMY':
      gameType = 'extraordinary';
      break;
    default:
      gameType = 'mundane';
  }

  return {
    id: scenarioData.id,
    title: scenarioData.title,
    description: generateScenarioDescription(scenarioData),
    narrativeText: fullNarrativeText,
    choices: generateEnhancedChoices(scenarioData, character),
    type: gameType,
    location: scenarioData.setting,
    timeOfDay: generateTimeOfDay(),
    weather: generateWeatherBasedOnTone(scenarioData.emotionalTone)
  };
}

function generateScenarioDescription(scenarioData: EnhancedScenarioData): string {
  const descriptions = {
    'NORMAL': 'A situation in your daily life requires careful consideration',
    'ANIMUS': 'Your magical powers present both opportunity and terrible temptation',
    'MINDREADING': 'Your telepathic abilities reveal information that changes everything',
    'PROPHECY': 'Visions of possible futures guide your path forward',
    'WARS': 'The brutal realities of conflict demand a difficult choice',
    'LEARNING': 'An opportunity for knowledge comes with unexpected risks',
    'ROMANCE': 'Matters of the heart complicate your path forward', 
    'FAMILY': 'Your role as a parent or child shapes this moment',
    'ACADEMY': 'Academy life presents challenges that will define your character',
    'SURVIVAL': 'Life and death hang in the balance of your next decision',
    'POLITICAL': 'The games of power and influence require careful navigation'
  };
  
  return descriptions[scenarioData.type] || descriptions['NORMAL'];
}

function generateAtmosphericText(setting: string, tone: 'tense' | 'peaceful' | 'dramatic' | 'mysterious' | 'romantic' | 'dangerous' | 'enlightening' | 'corrupt'): string {
  const atmosphericTexts = {
    'tense': [
      "The air itself seems to vibrate with tension.",
      "Every sound feels unnaturally loud in the charged atmosphere.",
      "Your heart pounds as the weight of the moment settles upon you."
    ],
    'peaceful': [
      "A sense of calm pervades this place, offering clarity for difficult decisions.", 
      "The peaceful surroundings provide a moment of tranquil reflection.",
      "Even the light here seems softer, more contemplative."
    ],
    'dramatic': [
      "The very air crackles with the importance of this moment.",
      "History pivots on choices like this one.",
      "The weight of destiny presses down upon your shoulders."
    ],
    'mysterious': [
      "Something about this situation feels significant in ways you cannot yet understand.",
      "Hidden currents of meaning flow beneath the surface of events.",
      "You sense there are layers to this situation that haven't been revealed."
    ],
    'romantic': [
      "The setting seems touched by magic, perfect for matters of the heart.",
      "Something in the air makes emotions feel more intense, more real.",
      "This moment feels like it belongs in the great love stories of dragon legend."
    ],
    'dangerous': [
      "Every instinct you possess screams that this situation could turn deadly in an instant.",
      "The scent of danger hangs heavy in the air around you.",
      "One wrong move could prove catastrophic."
    ],
    'enlightening': [
      "Understanding dawns as new perspectives reveal themselves.",
      "Knowledge flows through you like sunlight breaking through clouds.",
      "This moment offers the chance for true wisdom."
    ],
    'corrupt': [
      "Something feels fundamentally wrong about this place, this situation.",
      "The very air seems tainted with an influence that makes your scales crawl.",
      "Power whispers seductively, promising easy solutions to hard problems."
    ]
  };
  
  const options = atmosphericTexts[tone];
  return options[Math.floor(Math.random() * options.length)];
}

function generateTimeOfDay(): string {
  const times = ['pre-dawn darkness', 'early morning light', 'bright afternoon', 'golden sunset', 'deep night', 'moonlit evening'];
  return times[Math.floor(Math.random() * times.length)];
}

function generateWeatherBasedOnTone(tone: 'tense' | 'peaceful' | 'dramatic' | 'mysterious' | 'romantic' | 'dangerous' | 'enlightening' | 'corrupt'): string {
  const weatherByTone = {
    'tense': ['gathering storm clouds', 'oppressive humidity', 'unnaturally still air'],
    'peaceful': ['gentle breeze', 'warm sunlight', 'clear skies'],
    'dramatic': ['lightning in the distance', 'swirling winds', 'dramatic cloud formations'],
    'mysterious': ['shifting mists', 'strange atmospheric phenomena', 'ethereal lighting'],
    'romantic': ['soft starlight', 'gentle evening breeze', 'perfect temperature'],
    'dangerous': ['violent storm', 'treacherous conditions', 'ominous weather patterns'],
    'enlightening': ['brilliant clarity', 'perfect visibility', 'inspiring natural beauty'],
    'corrupt': ['unnatural darkness', 'sickly colored sky', 'oppressive atmospheric conditions']
  };
  
  const options = weatherByTone[tone];
  return options[Math.floor(Math.random() * options.length)];
}

// Export additional utility functions
export { EnhancedScenarioData, generateEnhancedChoices };