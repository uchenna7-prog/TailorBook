import { createContext, useContext } from 'react'


import aboveKneeMaleImg           from '../assets/maleMeasurementImages/aboveKneeMale.jpg'
import ankleMaleImg               from '../assets/maleMeasurementImages/ankleMale.jpg'
import armHoleMaleImg             from '../assets/maleMeasurementImages/armHoleMale.jpg'
import armLengthMaleImg           from '../assets/maleMeasurementImages/armLengthMale.jpg'
import belowKneeMaleImg           from '../assets/maleMeasurementImages/belowKneeMale.jpg'
import bicepsMaleImg              from '../assets/maleMeasurementImages/bicepsMale.jpg'
import calfMaleImg                from '../assets/maleMeasurementImages/calfMale.jpg'
import calfToAnkleMaleImg         from '../assets/maleMeasurementImages/calfToAnkleMale.jpg'
import chestMaleImg               from '../assets/maleMeasurementImages/chestMale.jpg'
import coatSleeveLengthMaleImg    from '../assets/maleMeasurementImages/coatSleeveLengthMale.jpg'
import coatWaistMaleImg           from '../assets/maleMeasurementImages/coatWaistMale.jpg'
import crossBackMaleImg           from '../assets/maleMeasurementImages/crossBackMale.jpg'
import crotchMaleImg              from '../assets/maleMeasurementImages/crotchMale.jpg'
import crotchToKneeMaleImg        from '../assets/maleMeasurementImages/crotchToKneeMale.jpg'
import flyMaleImg                 from '../assets/maleMeasurementImages/flyMale.jpg'
import halfShoulderMaleImg        from '../assets/maleMeasurementImages/halfShoulderMale.jpg'
import hipMaleImg                 from '../assets/maleMeasurementImages/hipMale.jpg'
import inseamMaleImg              from '../assets/maleMeasurementImages/inseamMale.jpg'
import jacketLengthMaleImg        from '../assets/maleMeasurementImages/jacketLengthMale.jpg'
import kneeToCalfMaleImg          from '../assets/maleMeasurementImages/kneeToCalfMale.jpg'
import neckMaleImg                from '../assets/maleMeasurementImages/neckMale.jpg'
import pantsLengthMaleImg         from '../assets/maleMeasurementImages/pantsLengthMale.jpg'
import seatMaleImg                from '../assets/maleMeasurementImages/seatMale.jpg'
import shirtLengthMaleImg         from '../assets/maleMeasurementImages/shirtLengthMale.jpg'
import shortsLengthMaleImg        from '../assets/maleMeasurementImages/shortsLengthMale.jpg'
import shoulderWidthMaleImg       from '../assets/maleMeasurementImages/shoulderWidthMale.jpg'
import sleeveLengthForSuitMaleImg from '../assets/maleMeasurementImages/sleeveLengthForSuitMale.jpg'
import sleeveLengthMaleImg        from '../assets/maleMeasurementImages/sleeveLengthMale.jpg'
import thighsMaleImg              from '../assets/maleMeasurementImages/thighsMale.jpg'
import waistMaleImg               from '../assets/maleMeasurementImages/waistMale.jpg'
import waistToAnkleMaleImg        from '../assets/maleMeasurementImages/waistToAnkleMale.jpg'
import wristMaleImg               from '../assets/maleMeasurementImages/wristMale.jpg'

import neckFemaleImg                            from '../assets/femaleMeasurementImages/neckFemale.jpg'
import frontNeckDepthFemaleImg                  from '../assets/femaleMeasurementImages/frontNeckDepthFemale.jpg'
import backNeckDepthFemaleImg                   from '../assets/femaleMeasurementImages/backNeckDepthFemale.jpg'
import shoulderFemaleImg                        from '../assets/femaleMeasurementImages/shoulderFemale.jpg'
import halfShoulderFemaleImg                    from '../assets/femaleMeasurementImages/halfShoulderFemale.jpg'
import frontShoulderFemaleImg                   from '../assets/femaleMeasurementImages/frontShoulderFemale.jpg'
import backShoulderFemaleImg                    from '../assets/femaleMeasurementImages/backShoulderFemale.jpg'
import shoulderToApexFemaleImg                  from '../assets/femaleMeasurementImages/shoulderToApexFemale.jpg'
import apexToApexFemaleImg                      from '../assets/femaleMeasurementImages/apexToApexFemale.jpg'
import upperChestFemaleImg                      from '../assets/femaleMeasurementImages/upperChestFemale.jpg'
import bustFemaleImg                            from '../assets/femaleMeasurementImages/bustFemale.jpg'
import chestFemaleImg                           from '../assets/femaleMeasurementImages/chestFemale.jpg'
import blouseChestFemaleImg                     from '../assets/femaleMeasurementImages/blouseChestFemale.jpg'
import blouseBelowBustFemaleImg                 from '../assets/femaleMeasurementImages/blouseBelowBust.jpg'
import armHoleFemaleImg                         from '../assets/femaleMeasurementImages/armHoleFemale.jpg'
import bicepsFemaleImg                          from '../assets/femaleMeasurementImages/bicepsFemale.jpg'
import armLengthFemaleImg                       from '../assets/femaleMeasurementImages/armLengthFemale.jpg'
import elbowLengthFemaleImg                     from '../assets/femaleMeasurementImages/elbowLengthFemale.jpg'
import sleeveLengthHalfFemaleImg                from '../assets/femaleMeasurementImages/sleeveLengthHalfFemale.jpg'
import capSleeveFemaleImg                       from '../assets/femaleMeasurementImages/capSleeveFemale.jpg'
import capSleeveCircularFemaleImg               from '../assets/femaleMeasurementImages/capSleeveCircularFemale.jpg'
import elbowCircularFemaleImg                   from '../assets/femaleMeasurementImages/elbowCircularFemale.jpg'
import threeFourthSleeveLengthFemaleImg         from '../assets/femaleMeasurementImages/threeFourthSleeveLengthFemale.jpg'
import threeFourthSleeveLengthCircularFemaleImg from '../assets/femaleMeasurementImages/threeFourthSleeveLengthCircularFemale.jpg'
import fullSleeveLengthFemaleImg                from '../assets/femaleMeasurementImages/fullSleeveLengthFemale.jpg'
import fullSleeveLengthCircularFemaleImg        from '../assets/femaleMeasurementImages/fullSleeveLengthCircularFemale.jpg'
import wristFemaleImg                           from '../assets/femaleMeasurementImages/wristFemale.jpg'
// Mid body
import stomachFemaleImg                         from '../assets/femaleMeasurementImages/stomachFemale.jpg'
import waistFemaleImg                           from '../assets/femaleMeasurementImages/waistFemale.jpg'
import blouseLengthFemaleImg                    from '../assets/femaleMeasurementImages/blouseLengthFemale.jpg'
import shirtLengthFemaleImg                     from '../assets/femaleMeasurementImages/shirtLengthFemale.jpg'
import stomachLengthFemaleImg                   from '../assets/femaleMeasurementImages/stomachLengthFemale.jpg'
import waistLengthFemaleImg                     from '../assets/femaleMeasurementImages/waistLengthFemale.jpg'
// Lower body
import hipFemaleImg                             from '../assets/femaleMeasurementImages/hipFemale.jpg'
import hipLengthFemaleImg                       from '../assets/femaleMeasurementImages/hipLengthFemale.jpg'
import crotchFemaleImg                          from '../assets/femaleMeasurementImages/crotchFemale.jpg'
import thighFemaleImg                           from '../assets/femaleMeasurementImages/thighFemale.jpg'
import thighLengthFemaleImg                     from '../assets/femaleMeasurementImages/thighLengthFemale.jpg'
import kneeLengthFemaleImg                      from '../assets/femaleMeasurementImages/kneeLengthFemale.jpg'
import calfFemaleImg                            from '../assets/femaleMeasurementImages/calfFemale.jpg'
import calfToAnkleFemaleImg                     from '../assets/femaleMeasurementImages/calfToAnkleFemale.jpg'
import ankleFemaleImg                           from '../assets/femaleMeasurementImages/ankleFemale.jpg'
import wristToAnkleFemaleImg                    from '../assets/femaleMeasurementImages/wristToAnkleFemale.jpg'
import fullHeightFemaleImg                      from '../assets/femaleMeasurementImages/fullHeightFemale.jpg'
import kurthiHeightFemaleImg                    from '../assets/femaleMeasurementImages/kurthiHeightFemale.jpg'


export const MALE_MEASUREMENTS = [
  // ── Upper body ──
  'Neck', 'Shoulder Width', 'Half Shoulder', 'Chest', 'Cross Back',
  'Arm Hole', 'Biceps', 'Arm Length', 'Sleeve Length', 'Coat Sleeve', 'Wrist',
  'Shirt Length', 'Jacket Length',
  // ── Mid body ──
  'Waist', 'Hip', 'Seat', 'Coat Waist',
  'Crotch', 'Fly', 'Inseam',
  // ── Lower body ──
  'Thighs', 'Crotch To Knee', 'Above Knee', 'Below Knee',
  'Knee To Calf', 'Calf', 'Calf To Ankle', 'Ankle',
  'Waist To Ankle', 'Pants Length', 'Shorts Length',
]

export const FEMALE_MEASUREMENTS = [
  // ── Upper body ──
  'Neck', 'Front Neck Depth', 'Back Neck Depth',
  'Shoulder', 'Half Shoulder', 'Front Shoulder', 'Back Shoulder',
  'Shoulder To Apex', 'Apex To Apex',
  'Upper Chest', 'Bust', 'Chest', 'Blouse Chest', 'Blouse Below Bust',
  'Arm Hole', 'Biceps', 'Arm Length',
  'Elbow Length', 'Sleeve Length Half',
  'Cap Sleeve', 'Cap Sleeve Circular',
  'Elbow Circular',
  'Three Fourth Sleeve Length', 'Three Fourth Sleeve Length Circular',
  'Full Sleeve Length', 'Full Sleeve Length Circular',
  'Wrist',
  // ── Mid body ──
  'Stomach', 'Waist',
  'Blouse Length', 'Shirt Length', 'Stomach Length', 'Waist Length',
  // ── Lower body ──
  'Hip', 'Hip Length', 'Crotch',
  'Thigh', 'Thigh Length', 'Knee Length',
  'Calf', 'Calf To Ankle', 'Ankle',
  'Wrist To Ankle', 'Full Height', 'Kurthi Height',
]


export const MALE_MEASUREMENT_IMAGES = {
  // ── Upper body ──
  'Neck':           neckMaleImg,
  'Shoulder Width': shoulderWidthMaleImg,
  'Half Shoulder':  halfShoulderMaleImg,
  'Chest':          chestMaleImg,
  'Cross Back':     crossBackMaleImg,
  'Arm Hole':       armHoleMaleImg,
  'Biceps':         bicepsMaleImg,
  'Arm Length':     armLengthMaleImg,
  'Sleeve Length':  sleeveLengthMaleImg,
  'Coat Sleeve':    sleeveLengthForSuitMaleImg,
  'Wrist':          wristMaleImg,
  'Shirt Length':   shirtLengthMaleImg,
  'Jacket Length':  jacketLengthMaleImg,
  // ── Mid body ──
  'Waist':          waistMaleImg,
  'Hip':            hipMaleImg,
  'Seat':           seatMaleImg,
  'Coat Waist':     coatWaistMaleImg,
  'Crotch':         crotchMaleImg,
  'Fly':            flyMaleImg,
  'Inseam':         inseamMaleImg,
  // ── Lower body ──
  'Thighs':         thighsMaleImg,
  'Crotch To Knee': crotchToKneeMaleImg,
  'Above Knee':     aboveKneeMaleImg,
  'Below Knee':     belowKneeMaleImg,
  'Knee To Calf':   kneeToCalfMaleImg,
  'Calf':           calfMaleImg,
  'Calf To Ankle':  calfToAnkleMaleImg,
  'Ankle':          ankleMaleImg,
  'Waist To Ankle': waistToAnkleMaleImg,
  'Pants Length':   pantsLengthMaleImg,
  'Shorts Length':  shortsLengthMaleImg,
}

export const FEMALE_MEASUREMENT_IMAGES = {
  // ── Upper body ──
  'Neck':                                    neckFemaleImg,
  'Front Neck Depth':                        frontNeckDepthFemaleImg,
  'Back Neck Depth':                         backNeckDepthFemaleImg,
  'Shoulder':                                shoulderFemaleImg,
  'Half Shoulder':                           halfShoulderFemaleImg,
  'Front Shoulder':                          frontShoulderFemaleImg,
  'Back Shoulder':                           backShoulderFemaleImg,
  'Shoulder To Apex':                        shoulderToApexFemaleImg,
  'Apex To Apex':                            apexToApexFemaleImg,
  'Upper Chest':                             upperChestFemaleImg,
  'Bust':                                    bustFemaleImg,
  'Chest':                                   chestFemaleImg,
  'Blouse Chest':                            blouseChestFemaleImg,
  'Blouse Below Bust':                       blouseBelowBustFemaleImg,
  'Arm Hole':                                armHoleFemaleImg,
  'Biceps':                                  bicepsFemaleImg,
  'Arm Length':                              armLengthFemaleImg,
  'Elbow Length':                            elbowLengthFemaleImg,
  'Sleeve Length Half':                      sleeveLengthHalfFemaleImg,
  'Cap Sleeve':                              capSleeveFemaleImg,
  'Cap Sleeve Circular':                     capSleeveCircularFemaleImg,
  'Elbow Circular':                          elbowCircularFemaleImg,
  'Three Fourth Sleeve Length':              threeFourthSleeveLengthFemaleImg,
  'Three Fourth Sleeve Length Circular':     threeFourthSleeveLengthCircularFemaleImg,
  'Full Sleeve Length':                      fullSleeveLengthFemaleImg,
  'Full Sleeve Length Circular':             fullSleeveLengthCircularFemaleImg,
  'Wrist':                                   wristFemaleImg,
  // ── Mid body ──
  'Stomach':                                 stomachFemaleImg,
  'Waist':                                   waistFemaleImg,
  'Blouse Length':                           blouseLengthFemaleImg,
  'Shirt Length':                            shirtLengthFemaleImg,
  'Stomach Length':                          stomachLengthFemaleImg,
  'Waist Length':                            waistLengthFemaleImg,
  // ── Lower body ──
  'Hip':                                     hipFemaleImg,
  'Hip Length':                              hipLengthFemaleImg,
  'Crotch':                                  crotchFemaleImg,
  'Thigh':                                   thighFemaleImg,
  'Thigh Length':                            thighLengthFemaleImg,
  'Knee Length':                             kneeLengthFemaleImg,
  'Calf':                                    calfFemaleImg,
  'Calf To Ankle':                           calfToAnkleFemaleImg,
  'Ankle':                                   ankleFemaleImg,
  'Wrist To Ankle':                          wristToAnkleFemaleImg,
  'Full Height':                             fullHeightFemaleImg,
  'Kurthi Height':                           kurthiHeightFemaleImg,
}

// ─────────────────────────────────────────────────────────────────────────────
// Convenience helper — returns the field list and image map for a given sex
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @param {'Male'|'Female'|string} sex
 * @returns {{ fields: string[], imgMap: Record<string, string> }}
 */
export function getMeasurementConfig(sex) {
  if (sex === 'Female') {
    return { fields: FEMALE_MEASUREMENTS, imgMap: FEMALE_MEASUREMENT_IMAGES }
  }
  return { fields: MALE_MEASUREMENTS, imgMap: MALE_MEASUREMENT_IMAGES }
}

// ─────────────────────────────────────────────────────────────────────────────
// Context (provides everything above via hook for convenience)
// ─────────────────────────────────────────────────────────────────────────────

const MeasurementImagesContext = createContext(null)

export function MeasurementImagesProvider({ children }) {
  // All values are module-level constants — no state or effects needed.
  const value = {
    MALE_MEASUREMENTS,
    FEMALE_MEASUREMENTS,
    MALE_MEASUREMENT_IMAGES,
    FEMALE_MEASUREMENT_IMAGES,
    getMeasurementConfig,
  }

  return (
    <MeasurementImagesContext.Provider value={value}>
      {children}
    </MeasurementImagesContext.Provider>
  )
}

export function useMeasurementImages() {
  const ctx = useContext(MeasurementImagesContext)
  if (!ctx) throw new Error('useMeasurementImages must be used inside <MeasurementImagesProvider>')
  return ctx
}