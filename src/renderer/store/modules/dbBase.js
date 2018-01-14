const state = {
  tensioning: {
    id: '',
    bridgeName: '',
    holeId: '',
    deviceId: '',
    steelStrandId: '',
    state: 0,
    concretes: {
      sampleNumber: null,
      sampleStrength: null,
      designStrength: null,
      tensioningStrengthNow: null,
      castingDate: '',
    },
    data: [
      {
        name: '',
        state: 0,
        tensioningKN: 0,
        steelStrandNumber: 0,
        length: 0,
        tensioningPattern: 0,
        stage: 0,
        two: false,
        exceed: false,
        task: {
          stage: [],
          time: [],
          A1: { LQ: 0, NS: 0, LL: 0 },
          A2: { LQ: 0, NS: 0 },
        },
        recird: {
          time: [],
          A1: {
            Mpa: [],
            mm: [],
            initMpa: 0,
            initMM: 0,
            retractionMM: 0,
            LZ: 0,
            deviation: 0,
          },
          A2: {
            Mpa: [],
            mm: [],
            initMpa: 0,
            initMM: 0,
            retractionMM: 0,
          },
          startDate: 0,
          endDate: 0,
        },
        curves: {
          A1Mpa: [],
          A1mm: [],
          A2Mpa: [],
          A2mm: [],
          B1Mpa: [],
          B1mm: [],
          B2Mpa: [],
          B2mm: [],
        },
      },
    ],
  },
};

const mutations = {
};

const actions = {
};

export default {
  state,
  mutations,
  actions,
};
