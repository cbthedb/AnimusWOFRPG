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
      "Within the dangerous volcanic chambers of the old Night Kingdom, you've discovered NightWing artifacts that predate the tribe's exile. These relics hint at powers and knowledge that were lost when the NightWings fled their homeland.",
      "The volcanic activity makes exploration incredibly dangerous, with lava flows and toxic gases threatening any dragon who ventures too deep. However, the artifacts you've glimpsed could contain secrets about prophecy and mind-reading abilities.",
      "Ancient warnings carved into the walls suggest that some knowledge was deliberately hidden or destroyed. Pursuing these secrets might uncover powers that the NightWings chose to abandon for good reason."
    ]
  },

  // PANTALA SCENARIOS
  {
    id: "jewel_hive_mind_control",
    locationId: "jewel_hive",
    title: "The Queen's Influence",
    setting: "Jewel Hive - Crystal Chambers",
    emotionalTone: "ominous",
    narrativeText: [
      "You can feel Queen Wasp's mind control abilities pressing against your consciousness as you navigate Jewel Hive. The other HiveWings move with eerie coordination, their individual personalities suppressed by the queen's overwhelming mental presence.",
      "A SilkWing servant whispers a warning that some visitors have never left the hive, their minds permanently enslaved. You notice your own thoughts becoming hazier the longer you remain in the crystalline chambers.",
      "Escape might be possible now, but staying longer could provide crucial intelligence about the HiveWing power structure. However, each moment you remain increases the risk of losing your mental freedom forever."
    ]
  },
  {
    id: "poison_jungle_resistance",
    locationId: "poison_jungle", 
    title: "The Green Rebellion",
    setting: "Deep Jungle - Hidden Resistance Camp",
    emotionalTone: "dramatic",
    narrativeText: [
      "You've discovered a secret LeafWing resistance camp hidden deep in the Poison Jungle. The rebels are planning a major strike against HiveWing oppression, but their methods are as dangerous as they are desperate.",
      "The LeafWings show you weapons made from the jungle's most toxic plants - substances that could kill hundreds of HiveWings but would also devastate the local ecosystem. Their leader argues that extreme measures are necessary for survival.",
      "They offer you a choice: join their cause and help strike a blow against tyranny, or leave and pretend you never found them. Neutrality isn't an option - they can't risk their location being revealed."
    ]
  },

  {
    id: "cicada_hive_silk_rebellion",
    locationId: "cicada_hive",
    title: "Underground Networks",
    setting: "Silk Production Facility - Hidden Chamber",
    emotionalTone: "tense",
    narrativeText: [
      "While touring Cicada Hive's silk production facilities, you discover that some SilkWings are using their work areas to communicate secretly. They've developed a code using silk patterns to coordinate resistance activities.",
      "A SilkWing worker approaches you cautiously, clearly assessing whether you can be trusted with dangerous information. They hint at plans to sabotage production and potentially help imprisoned dragons escape.",
      "The worker warns that HiveWing overseers are becoming suspicious of production irregularities. Getting involved could help the resistance, but being caught would likely result in imprisonment or worse."
    ]
  }
];

export class LocationBasedScenarios {
  static getScenariosByLocation(locationId: string): LocationScenario[] {
    return LOCATION_BASED_SCENARIOS.filter(scenario => scenario.locationId === locationId);
  }

  static getRandomLocationScenario(locationId: string, character: Character): LocationScenario | null {
    const availableScenarios = LOCATION_BASED_SCENARIOS.filter(scenario => {
      if (scenario.locationId !== locationId) return false;
      if (scenario.requirements && !scenario.requirements(character)) return false;
      return true;
    });

    if (availableScenarios.length === 0) return null;
    
    return availableScenarios[Math.floor(Math.random() * availableScenarios.length)];
  }

  static getAllLocationScenarioIds(locationId: string): string[] {
    return LOCATION_BASED_SCENARIOS
      .filter(scenario => scenario.locationId === locationId)
      .map(scenario => scenario.id);
  }
}