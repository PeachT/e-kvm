// 数据库初始化数据
const initData = {
  main: {
    // 管理员
    admin: {
      name: 'admin',
      pwd: 'admin',
      permissions: 9,
    },
    // 用户表 数据库文件名称"userId+user"
    userInfo: {
      userId: '',
      projectName: '项目名称',
      engineeringName: '工程名称',
      constructionUnit: '施工单位',
      girderFactory: '预制梁厂',
      supervisorUnit: '监理单位',
      unitEngineering: '单位工程',
      subdivision: '分部工程',
      subPoject: '分项工程',
      contractNumber: '土建合同号',
      pileNumber: '压桩号',
      engineeringPart: '工程部位',
      logo: '',
      // 监理资料
      supervisors: {
        name: '监理名称',
        img: '',
      },
    },
  },
  // 用户信息 数据库文件名称"userId+user"
  // 用户表中的文档
  tensioningData: { // 张拉数据
    id: '',
    bridgeName: '梁号',
    structureName: '构件名称',
    structureHoleName: '构件孔名称',
    device: '', // 设备id 未张拉使用全局的设备 已张拉使用用户下的设备
    steelStrand: '', // 钢绞线id 未张拉使用全局的钢绞线 已张拉使用用户下的钢绞线
    concretes: { // 混凝土数据
      sampleNumber: '试块编号',
      sampleStrength: '试块强度',
      designStrength: '设计强度',
      tensioningStrengthNow: '张拉时强度',
      castingDate: '浇筑日期',
    },
    group: [ // 张拉组数据
      {
        name: 'N1/N2', // 用 ‘/’ 号隔开A，B组张拉孔号 只有一个孔时不要‘/’号
        state: 0, // 张拉状态 0未张拉 1已张拉
        tensioningKN: 1245, // 张拉控制应力
        steelStrandNumber: 6, // 钢绞线数量
        length: 20, // 张拉长度
        tensioningPattern: 0, // 0~4 依次 A1单顶 A两顶 B1单顶 B两顶 四顶
        two: false, // 二次张拉
        exceed: false, // 超张拉
        task: { // 任务数据
          A1: {
            LQ: 4, // 千斤顶工作段伸长量（LQ
            NS: 6, // 钢绞线内缩量均值（NS）
            LL: 125, // 理论伸长量(LL)
          },
          A2: {
            LQ: 4,
            NS: 6,
          },
          B1: {
            LQ: 4,
            NS: 6,
            LL: 125,
          },
          B2: {
            LQ: 4,
            NS: 6,
          },
          stage: [10, 20, 50, 100], // 张拉阶段
          time: [30, 30, 30, 30], // 持荷时间
        },
        curveId: '', // 曲线id
        time: [], // 持荷时间
        date: '2017-12-12', // 张拉日期
        startTime: '12:12', // 张拉开始时间
        endTime: '12:12', // 张拉开始时间
        recird: { // 记录数据
          A1: {
            Mpa: [], // 压力
            mm: [], // 位移
            initMpa: [], // 回到初张拉压力
            initMM: [], // 回到初张拉位移
            retractionMM: 8, // 力筋回缩量
            LZ: 128, // 总伸长量（LZ）
            deviation: 0.5, // 偏差率
          },
          A2: {
            Mpa: [], // 压力
            mm: [], // 位移
            initMpa: [], // 回到初张拉压力
            initMM: [], // 回到初张拉位移
            retractionMM: 8, // 力筋回缩量
          },
          B1: {
            Mpa: [], // 压力
            mm: [], // 位移
            initMpa: [], // 回到初张拉压力
            initMM: [], // 回到初张拉位移
            retractionMM: 8, // 力筋回缩量
            LZ: 128, // 总伸长量（LZ）
            deviation: 0.5, // 偏差率
          },
          B2: {
            Mpa: [], // 压力
            mm: [], // 位移
            initMpa: [], // 回到初张拉压力
            initMM: [], // 回到初张拉位移
            retractionMM: 8, // 力筋回缩量
          },
        },
        curves: [ // 曲线
          {
            id: '',
            time: [],
            A1Mpa: [],
            A2Mpa: [],
            B1Mpa: [],
            B2Mpa: [],
            A1mm: [],
            A2mm: [],
            B1mm: [],
            B2mm: [],
          },
        ],
      },
    ],
  },
  // 曲线数据 数据库文件名使用"userId+curve"
  // id 梁id+组名称
  // 用户表中的文档
  // 操作员
  operator: {
    name: '操作员',
    pwd: '123',
    img: '',
  },
  // 钢绞线
  steelStrands: {
    specs: '1860',
    elasticityModulus: '弹性模量',
    prestress: '控制应力',
    reportNumber: '报告编号',
    demarcationDate: '标定日期',
  },
  // 混凝土
  concretes: {
    sampleNumber: '试块编号',
    sampleStrength: '试块强度',
    designStrength: '设计强度',
  },
  // 设备
  device: {
    name: '100T',
    liftingJackModel: '千斤顶型号',
    oilPumpModel: '油泵型号',
    tensioningPattern: [], // 张拉模式
    equation: false, // 方程选择true F=aP+b， false P=aF+b
    A1: {
      liftingJackNumber: '千斤顶编号',
      oilPumpNumber: '油泵编号',
      demarcationDate: '',
      a: 0, // 方程常数a
      b: 0, // 方程常数b
    },
    A2: {
      liftingJackNumber: '千斤顶编号',
      oilPumpNumber: '油泵编号',
      demarcationDate: '',
      a: 0,
      b: 0,
    },
    B1: {
      liftingJackNumber: '千斤顶编号',
      oilPumpNumber: '油泵编号',
      demarcationDate: '',
      a: 0,
      b: 0,
    },
    B2: {
      liftingJackNumber: '千斤顶编号',
      oilPumpNumber: '油泵编号',
      demarcationDate: '',
      a: 0,
      b: 0,
    },
  },
  // 构件
  girder: {
    name: '构件名称',
    hole: {
      name: '孔名称',
      detail: [], // 孔明细
      state: true, // 启用禁用
    },
  },
};

export default initData;
