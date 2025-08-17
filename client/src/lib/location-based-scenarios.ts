import { Character } from "@shared/schema";
import { Location } from "./location-system";

// Location-specific scenarios based on Wings of Fire lore
export interface LocationScenario {
  id: string;
  locationId: string;
  title: string;
  setting: string;
  emotionalTone: "peaceful" | "tense" | "dramatic" | "enlightening" | "ominous";
  narrativeText: string[];
  requirements?: (character: Character) => boolean;
  contextualModifiers?: (character: Character, gameData: any) => string[];
}

export const LOCATION_BASED_SCENARIOS: LocationScenario[] = [
  // JADE MOUNTAIN ACADEMY SCENARIOS
  {
    id: "academy_new_student_orientation",
    locationId: "jade_mountain_academy",
    title: "New Student Integration",
    setting: "Academy Main Hall",
    emotionalTone: "peaceful",
    narrativeText: [
      "A nervous young dragon from a tribe you've never seen before approaches during orientation. They're clearly overwhelmed by the mix of different tribes and the academy's size.",
      "Other students are already forming cliques based on their tribes, leaving this newcomer isolated. You notice they haven't eaten anything at the welcome feast.",
      "This could be an opportunity to make a friend from a different background, or you could stick with your own kind for safety."
    ]
  },
  {
    id: "academy_library_discovery",
    locationId: "jade_mountain_academy",
    title: "Forbidden Knowledge",
    setting: "Academy Library - Restricted Section",
    emotionalTone: "dramatic",
    narrativeText: [
      "While researching for class, you discover a hidden section of the library containing scrolls about animus magic that predates the academy. The texts describe techniques that even modern animus dragons consider dangerous.",
      "The knowledge here could greatly enhance your understanding of magic, but these scrolls are clearly restricted for good reason. Some of the techniques described have warnings written in multiple languages.",
      "A librarian is approaching, and you need to decide quickly whether to hide the scroll, confront them about the restriction, or put it back and pretend you never saw it."
    ]
  },

  // MUD KINGDOM SCENARIOS
  {
    id: "mud_kingdom_healing_ceremony",
    locationId: "mud_kingdom",
    title: "Ancient Healing Ritual",
    setting: "Sacred Mud Springs",
    emotionalTone: "enlightening",
    narrativeText: [
      "The MudWing elders have invited you to participate in an ancient healing ceremony at the sacred mud springs. Dragons with various ailments have gathered, seeking the legendary restorative powers of the mineral-rich mud.",
      "The ritual involves not just physical healing, but spiritual cleansing. You're told that those who undergo the ceremony with pure intentions will find their inner wounds healed as well as their physical ones.",
      "However, the elders warn that the springs reject those with corruption in their hearts, potentially making such dragons even sicker. Your soul's current state may determine whether this healing helps or harms you."
    ]
  },
  {
    id: "mud_kingdom_sibling_bonds", 
    locationId: "mud_kingdom",
    title: "The Sibling Test",
    setting: "MudWing Military Training Grounds",
    emotionalTone: "tense",
    narrativeText: [
      "MudWing culture revolves around sibling bonds and family loyalty. A group of MudWing siblings challenge you to prove your understanding of family by participating in their traditional bonding exercises.",
      "The challenge involves protecting artificial 'siblings' (wooden training dummies) while navigating a dangerous obstacle course. Failure means you don't understand the sacred bond of family protection.",
      "Your performance will determine how MudWings view you throughout the kingdom. Success could earn you honorary sibling status, while failure might mark you as someone who doesn't value family bonds."
    ]
  },

  // SAND KINGDOM SCENARIOS
  {
    id: "sand_kingdom_treasure_hunt",
    locationId: "sand_kingdom",
    title: "The Great Treasure Hunt",
    setting: "Ancient Desert Ruins",
    emotionalTone: "dramatic",
    narrativeText: [
      "Deep in the Sand Kingdom's vast dunes, you've discovered ruins from before the Scorching. Local SandWings speak of a legendary treasure hidden within, but also of the curse that protects it.",
      "The ruins are filled with traps designed by ancient dragons, and previous treasure hunters have left warnings carved into the walls. Some warn of magical guardians, others of psychological torments that drive dragons mad.",
      "You must decide whether to brave the ruins alone, seek SandWing allies who know the desert's secrets, or report the discovery to authorities and potentially lose your chance at the treasure."
    ]
  },
  {
    id: "sand_kingdom_succession_politics",
    locationId: "sand_kingdom",
    title: "Political Intrigue",
    setting: "Scorpion Den - Political Quarter",
    emotionalTone: "tense",
    narrativeText: [
      "You've inadvertently become involved in SandWing succession politics when a minor royal asks you to deliver a message to a rival faction. The contents of the message are sealed, but you suspect it concerns the ongoing power struggles within the tribe.",
      "Both factions have offered you rewards for your cooperation, but choosing sides in SandWing politics is incredibly dangerous. The faction you don't help could consider you an enemy for life.",
      "To complicate matters, you've overheard hints that the message might contain information about planned violence. Delivering it could make you complicit in political assassination."
    ]
  },

  // SKY KINGDOM SCENARIOS
  {
    id: "sky_kingdom_aerial_challenge",
    locationId: "sky_kingdom",
    title: "The Sky Trials",
    setting: "High Mountain Peaks",
    emotionalTone: "dramatic",
    narrativeText: [
      "The SkyWings have challenged you to prove your worth through their traditional aerial trials. The tests involve flying through treacherous mountain passes, dodging falling rocks, and demonstrating precision flying in thin air.",
      "Your performance in these trials will determine your standing among SkyWings throughout the kingdom. Exceptional performance might even earn you recognition from the SkyWing royalty.",
      "However, the trials are genuinely dangerous - several dragons have died attempting them. You must balance the desire for honor with the very real risk to your life."
    ]
  },
  {
    id: "sky_kingdom_mountain_rescue",
    locationId: "sky_kingdom",
    title: "Storm Rescue Mission",
    setting: "Storm-Lashed Peaks",
    emotionalTone: "tense",
    narrativeText: [
      "A fierce mountain storm has trapped a group of young dragons on a high peak with no shelter. The SkyWing rescue services are overwhelmed with other emergencies, and time is running out before the dragons freeze or are blown off the mountain.",
      "The storm is too dangerous for most rescue attempts, with winds strong enough to slam even experienced fliers into the mountainside. However, you might have abilities or knowledge that could make the difference.",
      "Each moment you deliberate, the trapped dragons are in greater danger. But rushing into the storm without a solid plan could result in more casualties, including yourself."
    ]
  },

  // Additional JADE MOUNTAIN ACADEMY SCENARIOS
  {
    id: "academy_winglet_rivalry",
    locationId: "jade_mountain_academy",
    title: "Winglet Competition",
    setting: "Academy Training Grounds",
    emotionalTone: "tense",
    narrativeText: [
      "The annual inter-winglet competition has begun, and tensions run high between the different student groups. Your winglet has been challenged to a series of contests by the reigning champions.",
      "The competition covers flight maneuvers, combat training, and academic challenges. Winning would bring honor to your winglet but also create enemies among the losing groups.",
      "Some students are suggesting underhanded tactics to ensure victory, while others insist on fair play. Your choice could define your winglet's reputation for years to come."
    ]
  },
  {
    id: "academy_professor_mystery",
    locationId: "jade_mountain_academy",
    title: "The Missing Professor",
    setting: "Academy Underground Tunnels",
    emotionalTone: "ominous",
    narrativeText: [
      "Professor Webs has been missing for three days, and strange sounds echo from the academy's underground tunnel system. The administration claims he's simply ill, but you know better.",
      "You've discovered claw marks on the tunnel walls and what appears to be signs of a struggle. Other students are too frightened to investigate, leaving the mystery unsolved.",
      "The tunnels are supposedly dangerous and off-limits, but they might hold the key to finding the missing professor before it's too late."
    ]
  },

  // Additional MUD KINGDOM SCENARIOS  
  {
    id: "mud_kingdom_family_honor",
    locationId: "mud_kingdom", 
    title: "A Family's Honor",
    setting: "MudWing Village Square",
    emotionalTone: "dramatic",
    narrativeText: [
      "A MudWing family has been accused of cowardice after their eldest son fled from a battle. The shame threatens to destroy their standing in the community and affect their younger dragonets.",
      "The family patriarch begs you to help restore their honor, offering a family heirloom as payment. However, doing so would require you to publicly vouch for dragons you don't really know.",
      "The alternative is to remain neutral, but the family's desperation suggests that without help, they may be forced to leave their ancestral home forever."
    ]
  },
  {
    id: "mud_kingdom_drought_crisis",
    locationId: "mud_kingdom",
    title: "The Great Drought", 
    setting: "Dried Riverbed",
    emotionalTone: "tense",
    narrativeText: [
      "A severe drought has dried up the sacred mud springs that give MudWings their strength. The tribal elders are desperate for a solution as their dragons grow weak without the mineral-rich mud.",
      "Ancient texts speak of a hidden spring deep in dangerous territory, but the journey would be perilous and might claim lives. Some suggest asking other tribes for help, risking pride for survival.",
      "Time is running out as younger dragonets begin showing signs of serious weakness. Your advice could determine whether the MudWings maintain their independence or humble themselves before other tribes."
    ]
  },

  // Additional SAND KINGDOM SCENARIOS
  {
    id: "sand_kingdom_oasis_conflict", 
    locationId: "sand_kingdom",
    title: "The Disputed Oasis",
    setting: "Remote Desert Oasis",
    emotionalTone: "tense",
    narrativeText: [
      "Two SandWing clans claim ownership of the same vital oasis, and their dispute has escalated to the brink of violence. Both have legitimate historical claims to the water source.",
      "The oasis is large enough to support both clans, but pride and old grudges prevent them from sharing. A neutral mediator could resolve this peacefully, or it could explode into tribal warfare.",
      "Travelers need the oasis for survival, but taking sides could make you enemies for life. Meanwhile, the longer this drags on, the more likely it is that dragons will die fighting over water."
    ]
  },
  {
    id: "sand_kingdom_ancient_curse",
    locationId: "sand_kingdom", 
    title: "The Cursed Pyramid",
    setting: "Ancient Pyramid Ruins",
    emotionalTone: "ominous", 
    narrativeText: [
      "Local SandWings warn you away from an ancient pyramid, claiming it's cursed by the spirits of long-dead animus dragons. Strange lights flicker inside at night, and those who enter often emerge... changed.",
      "A scholar offers to pay handsomely for artifacts from within, insisting the 'curse' is merely superstition. However, you've noticed that several recent visitors to the pyramid now speak in whispers and avoid sunlight.",
      "The pyramid clearly contains something valuable, but whether it's treasure, knowledge, or something far more dangerous remains unknown. The locals' fear seems genuine, but so does the scholar's desperation."
    ]
  },

  // Additional SKY KINGDOM SCENARIOS
  {
    id: "sky_kingdom_territorial_dispute",
    locationId: "sky_kingdom",
    title: "Border Skirmish",
    setting: "Sky Kingdom Border Mountains",
    emotionalTone: "tense",
    narrativeText: [
      "SkyWing border guards have intercepted you near a disputed mountain pass. They claim you've entered restricted airspace, though the borders seem arbitrarily drawn and change frequently.",
      "The guards are young and nervous, clearly eager to prove themselves by making an arrest. However, their commander seems more interested in gathering information about travelers than enforcing arbitrary rules.",
      "This could be a simple misunderstanding, a test of your intentions, or something more serious. Your response will determine whether you continue your journey peacefully or end up in a SkyWing prison."
    ]
  },
  {
    id: "sky_kingdom_storm_prophecy",
    locationId: "sky_kingdom",
    title: "The Storm Prophet", 
    setting: "Windswept Mountain Peak",
    emotionalTone: "ominous",
    narrativeText: [
      "An elderly SkyWing prophet claims to read the future in storm patterns, and her recent visions have the local population terrified. She speaks of a great catastrophe coming to those who fly too high.",
      "Some dragons dismiss her as mad, but her previous prophecies have proven disturbingly accurate. She singles you out from the crowd, claiming your arrival was foretold in the lightning patterns.",
      "The prophet offers to share her vision with you, but warns that knowledge of the future comes with a price. The growing storm above seems to respond to her words, lightning striking closer with each prophecy."
    ]
  },

  // SEA KINGDOM SCENARIOS  
  {
    id: "sea_kingdom_deep_court",
    locationId: "sea_kingdom",
    title: "The Deep Court's Judgment",
    setting: "Abyssal Palace Depths",
    emotionalTone: "ominous",
    narrativeText: [
      "You've been summoned before the SeaWing Deep Court, an ancient council that meets in the deepest parts of the ocean where sunlight never reaches. They're said to judge matters too important or dangerous for the surface royalty.",
      "The Deep Court's chambers are illuminated only by bioluminescent sea creatures and the council members' own glowing patterns. The pressure here is crushing, and the darkness seems to whisper of ancient secrets.",
      "They're investigating reports of a surface dweller meddling in sea affairs. Depending on how you present yourself, you could be welcomed as an ally or condemned as a threat to SeaWing security."
    ],
    requirements: (character) => character.tribalPowers.includes("Underwater Breathing") || character.isAnimus
  },
  {
    id: "sea_kingdom_coral_gardens",
    locationId: "sea_kingdom", 
    title: "The Dying Gardens",
    setting: "Royal Coral Gardens",
    emotionalTone: "dramatic",
    narrativeText: [
      "The SeaWing royal coral gardens, once vibrant and teeming with life, are dying from an unknown cause. The royal gardeners are desperate to find a solution before the ecological disaster spreads to the wider ocean.",
      "You notice patterns in the coral death that others have missed - it seems to be following magical currents rather than natural ones. This could be the result of animus magic, environmental damage, or something far more sinister.",
      "The SeaWing royalty will richly reward whoever can save their gardens, but investigating the cause might expose you to whatever force is killing the coral in the first place."
    ],
    requirements: (character) => character.tribalPowers.includes("Underwater Breathing") || character.isAnimus
  },

  // ICE KINGDOM SCENARIOS
  {
    id: "ice_kingdom_ranking_challenge",
    locationId: "ice_kingdom",
    title: "The Circle Challenge",
    setting: "IceWing Ranking Circles",
    emotionalTone: "tense",
    narrativeText: [
      "You've been challenged to prove your worth within the IceWing ranking system. As an outsider, you start at the bottom of the Seventh Circle, but exceptional performance in challenges can rapidly advance your status.",
      "The ranking challenge involves tests of intelligence, combat skill, and adherence to IceWing traditions. Your current circle determines everything from where you can live to whom you can speak to.",
      "However, IceWing politics are treacherous. Some dragons may try to sabotage your performance to maintain their own positions, while others might see you as a useful ally to advance their own standing."
    ]
  },
  {
    id: "ice_kingdom_ancient_ice",
    locationId: "ice_kingdom",
    title: "The Ancient Ice Prison",
    setting: "Frozen Wastelands - Ancient Ruins",
    emotionalTone: "ominous",
    narrativeText: [
      "Deep in the Ice Kingdom's frozen wastes, you've discovered structures made of ice that never melts. Local IceWings whisper that these are prisons from the age of legends, built to contain dragons too dangerous to kill.",
      "The ice seems to pulse with its own cold light, and you can hear faint sounds from within - voices that might be cries for help or warnings to stay away. The magical emanations are unlike anything you've encountered.",
      "An ancient IceWing appears and warns you that some prisons were built not to keep prisoners in, but to keep something else out. Opening the wrong chamber could release threats that predate the modern tribes."
    ]
  },

  // RAINFOREST KINGDOM SCENARIOS
  {
    id: "rainforest_peace_meditation",
    locationId: "rainforest_kingdom",
    title: "The Great Peace",
    setting: "Canopy Temple - Sacred Grove",
    emotionalTone: "peaceful",
    narrativeText: [
      "The RainWings have invited you to participate in their most sacred ritual - the Great Peace meditation. This ceremony is said to wash away anger, violence, and corruption from the soul.",
      "Surrounded by ancient trees and the gentle sound of tropical rain, you feel the stress and conflict of your recent adventures beginning to fade. The RainWing elders guide you through breathing exercises that seem almost magical in their calming effect.",
      "This could be exactly what your spirit needs after the trials you've faced, potentially restoring your inner balance. However, some part of you wonders if letting go of your edge might leave you vulnerable to future threats."
    ]
  },
  {
    id: "rainforest_venom_training",
    locationId: "rainforest_kingdom",
    title: "Venom Mastery",
    setting: "RainWing Training Groves",
    emotionalTone: "enlightening",
    narrativeText: [
      "A RainWing venom expert offers to teach you about their tribe's deadly defensive abilities. The training involves not just learning about different venom types, but understanding the philosophy of when and why to use such powerful weapons.",
      "The instructor explains that venom is both protection and burden - it can save your life, but using it changes you. They share stories of RainWings who became too comfortable with violence after mastering their venom.",
      "You must decide how much you want to learn. Basic knowledge could save your life, but deeper training in venom combat might awaken a more violent side of your nature."
    ]
  },

  // NIGHTWING VILLAGE SCENARIOS  
  {
    id: "nightwing_village_integration",
    locationId: "rainforest_night_village",
    title: "Cultural Fusion",
    setting: "Mixed Tribe Village Center",
    emotionalTone: "enlightening",
    narrativeText: [
      "The NightWing-RainWing village represents something unprecedented in dragon history - two tribes learning to live as one community. You witness daily interactions between dragons whose cultures couldn't be more different.",
      "A dispute has arisen over architectural styles for new buildings. Some NightWings want their traditional dark, angular designs while RainWings prefer organic, tree-integrated structures that blend with the forest.",
      "Your input could help shape how this experimental community develops. The decisions made here might serve as a model for inter-tribal cooperation throughout Pyrrhia."
    ]
  },

  // OLD NIGHT KINGDOM SCENARIOS
  {
    id: "old_night_kingdom_volcano_secrets",
    locationId: "night_kingdom_old",
    title: "Volcanic Revelations",
    setting: "Active Volcano - Ancient Chambers",
    emotionalTone: "ominous",
    narrativeText: [
      "Deep within the volcanic tunnels of the old Night Kingdom, you discover chambers that predate the tribe's exodus. Ancient scrolls and artifacts lie scattered among the lava flows, preserved by the dry heat.",
      "The volcanic activity seems to be increasing, and local dragons whisper that it's because the mountain is angry about the NightWings' abandonment. Strange magical currents flow through the lava, suggesting this was once a place of great power.",
      "Some of the artifacts bear Darkstalker's mark, while others seem older still. Taking anything could provide valuable knowledge, but disturbing this place might awaken forces better left sleeping."
    ]
  },
  {
    id: "old_night_kingdom_darkstalker_legacy",
    locationId: "night_kingdom_old", 
    title: "The Darkstalker Shrine",
    setting: "Hidden Mountain Shrine",
    emotionalTone: "ominous",
    narrativeText: [
      "You discover a hidden shrine dedicated to Darkstalker, maintained by a secretive cult of NightWings who never left the old kingdom. They believe he will return to reclaim his rightful place as ruler of all dragons.",
      "The cultists offer to share their 'true' history of Darkstalker, claiming that the stories told in schools are lies meant to discredit him. Their version paints him as a misunderstood hero who was betrayed by those he tried to save.",
      "They have artifacts and spells that they claim belonged to Darkstalker himself. Joining them could grant access to incredible power, but their fanatical devotion suggests they might be dangerous to refuse or cross."
    ]
  }
];

// Class to manage location-based scenarios
export class LocationBasedScenarios {
  static getRandomLocationScenario(locationId: string, character: Character): LocationScenario | null {
    const locationScenarios = LOCATION_BASED_SCENARIOS.filter(scenario => {
      // Match location ID
      if (scenario.locationId !== locationId) return false;
      
      // Check requirements if any
      if (scenario.requirements && !scenario.requirements(character)) return false;
      
      return true;
    });
    
    if (locationScenarios.length === 0) return null;
    
    return locationScenarios[Math.floor(Math.random() * locationScenarios.length)];
  }
  
  static getAllScenariosForLocation(locationId: string): LocationScenario[] {
    return LOCATION_BASED_SCENARIOS.filter(scenario => scenario.locationId === locationId);
  }
  
  static getScenarioById(scenarioId: string): LocationScenario | null {
    return LOCATION_BASED_SCENARIOS.find(scenario => scenario.id === scenarioId) || null;
  }
}