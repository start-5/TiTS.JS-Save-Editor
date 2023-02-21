/* eslint-disable no-unused-vars */

// Observations:
// Some characters have more or less keys (at least on the save file) but they seem to be internal and specific to that character
// This class will eventually be used to be able to edit properties specific to a character

class Character {
    constructor() {
        this.a = '';
        this.affinity = '';
        this.aimMod = 0;
        this.alreadyDefeated = false;
        this.analVirgin = false;
        this.antennae = 0;
        this.antennaeType = 0;
        this.armFlags = [];
        this.armType = 0;
        this.ass = [];
        this.balls = 0;
        this.ballSizeMod = 0;
        this.ballSizeRaw = 0;
        this.baseHPResistances = [];
        this.baseShieldResistances = [];
        this.beardColor = '';
        this.beardLength = 0;
        this.beardStyle = 0;
        this.beardType = 0;
        this.bellyRatingMod = 0;
        this.bellyRatingRaw = 0;
        this.breastRows = [];
        this.btnTargetText = null;
        this.buttonText = null;
        this.buttRatingMod = 0;
        this.buttRatingRaw = 0;
        this.buyMarkdown = 0;
        this.capitalA = '';
        this.characterClass = 0;
        this.classInstance = 0;
        this.clitLength = 0;
        this.cocks = [];
        this.cockVirgin = false;
        this.credits = 0;
        this.crotchFlags = [];
        this.cumMultiplierMod = 0;
        this.cumMultiplierRaw = 0;
        this.cumQualityMod = 0;
        this.cumQualityRaw = 0;
        this.cumType = 0;
        this.customBlock = '';
        this.customDodge = '';
        this.defaultBreastRowIndex = 0;
        this.defaultCockIndex = 0;
        this.defaultVaginaIndex = 0;
        this.dickNippleMultiplier = 0;
        this.dickNippleType = 0;
        this.earFlags = [];
        this.earLength = 0;
        this.earType = 0;
        this.eggs = 0;
        this.elasticity = 0;
        this.energyDisplayName = '';
        this.energyMod = 0;
        this.energyRaw = 0;
        this.exhibitionismRaw = 0;
        this.eyeColor = '';
        this.eyeType = 0;
        this.faceFlags = [];
        this.faceType = 0;
        this.femininity = 0;
        this.fertilityMod = 0;
        this.fertilityRaw = 0;
        this.fertilizedEggs = 0;
        this.fluidSimulate = false;
        this.furColor = '';
        this.genitalSpot = 0;
        this.gills = false;
        this.girlCumMultiplierMod = 0;
        this.girlCumMultiplierRaw = 0;
        this.girlCumType = 0;
        this.hairColor = '';
        this.hairLength = 0;
        this.hairStyle = '';
        this.hairType = 0;
        this.hipRatingMod = 0;
        this.hipRatingRaw = 0;
        this.hornLength = 0;
        this.horns = 0;
        this.hornType = 0;
        this.hpDisplayName = '';
        this.HPMod = 0;
        this.HPRaw = 0;
        this.impregnationType = '';
        this.intelligenceMod = 0;
        this.Internal_aimRaw = 0;
        this.Internal_ballEfficiency = 0,
        this.Internal_ballFullness = 0,
        this.Internal_intelligenceRaw = 0;
        this.Internal_libidoRaw = 0;
        this.Internal_physiqueRaw = 0;
        this.Internal_reflexesRaw = 0;
        this.Internal_taintRaw = 0;
        this.Internal_willpowerRaw = 0;
        this.inventory = [];
        this.isLustImmune = false,
        this.isPlural = false,
        this.isUniqueInFight = false,
        this.keeperBuy = '',
        this.keeperGreeting = '',
        this.keeperSell = '',
        this.keyItems = [];
        this.legCount = 0;
        this.legFlags = [];
        this.legType = 0;
        this.level = 0;
        this.libidoMod = 0;
        this.lipColor = '';
        this.lipMod = 0;
        this.long_internal = '';
        this.lustMod = 0;
        this.lustRaw = 0;
        this.lustSimulate = false;
        this.milkFullness = 0;
        this.milkMultiplier = 0;
        this.milkRate = 0;
        this.milkStorageMultiplier = 1;
        this.milkType = 0;
        this.minutesSinceCum = 0;
        this.neverSerialize = false;
        this.nippleColor = '';
        this.nippleLengthRatio = 0;
        this.nipplesPerBreast = 0;
        this.nippleWidthRatio = 0;
        this.originalRace = '';
        this.perks = [];
        this.personality = 0;
        this.physiqueMod = 0;
        this.pregnancyData = [];
        this.pregnancyIncubationBonusFatherMod = 0;
        this.pregnancyIncubationBonusFatherRaw = 0;
        this.pregnancyIncubationBonusMotherMod = 0;
        this.pregnancyIncubationBonusMotherRaw = 0;
        this.pregnancyMultiplierMod = 0;
        this.pregnancyMultiplierRaw = 0;
        this.reflexesMod = 0;
        this.refractoryRate = 0;
        this.scaleColor = '';
        this.scrotumColorRaw = '';
        this.scrotumTypeRaw = 0;
        this.sellMarkup = 0;
        this.sexualPreferences = [];
        this.shieldDisplayName = '';
        this.shieldsRaw = 0;
        this.short = '';
        this.skinAccent = '';
        this.skinFlags = [];
        this.skinTone = '';
        this.skinType = 0;
        this.statusEffects = [];
        this.statusSimulate = false;
        this.tailCock = [];
        this.tailCount = 0;
        this.tailCunt = [];
        this.tailFlags = [];
        this.tailType = 0;
        this.taintMod = 0;
        this.tallness = 0;
        this.thickness = 0;
        this.timesCum = 0;
        this.tone = 0;
        this.tongueFlags = [];
        this.tongueType = 0;
        this.typesBought = [];
        this.uniqueName = null;
        this.vaginalVirgin = true;
        this.vaginas = [];
        this.version = 1;
        this.willpowerMod = 0;
        this.wingCount = 0;
        this.wingType = 0;
    }
}