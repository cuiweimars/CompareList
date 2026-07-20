export interface WorkspaceCopy {
  projects: string;
  projectsDescription: string;
  noProjects: string;
  saveProject: string;
  projectName: string;
  projectNamePlaceholder: string;
  saveContent: string;
  saveContentDescription: string;
  settingsOnly: string;
  localOnly: string;
  save: string;
  saved: string;
  open: string;
  pin: string;
  unpin: string;
  exportProject: string;
  importProject: string;
  importFailed: string;
  compareNewVersion: string;
  compareNewVersionDescription: string;
  baselineKept: string;
  recent: string;
  contentSaved: string;
  contentNotSaved: string;
  updatedJustNow: string;
  clearAll: string;
  close: string;
  delete: string;
  cancel: string;
  activity: string;
  emptyActivity: string;
  showChart: string;
  hideChart: string;
  addedRows: string;
  removedRows: string;
  changedRows: string;
  unchangedRows: string;
  allRows: string;
  noRows: string;
  exportReport: string;
  previewData: string;
  hidePreview: string;
  detectedEncoding: string;
  supportedFileTypes: string;
  fileParsingFailed: string;
  compareRules: string;
  columnMapping: string;
  autoMap: string;
  ignoreColumn: string;
  numericTolerance: string;
  normalizeDates: string;
  emptyValuesEqual: string;
  ignorePunctuation: string;
  recommendedKey: string;
  rememberRules: string;
  rulesSaved: string;
  exportExcel: string;
  exportCsv: string;
  filterRows: string;
  copyFiltered: string;
  acceptMatch: string;
  rejectMatch: string;
  matchAccepted: string;
  matchRejected: string;
  reviewMatches: string;
  templates: string;
  customTemplate: string;
  templateApplied: string;
  shareProject: string;
  shareDialogDescription: string;
  includeShareContent: string;
  sharePrivacyWarning: string;
  shareRulesOnly: string;
  shareCopied: string;
  shareTooLarge: string;
  copyShareLink: string;
  sharedWorkspaceLoaded: string;
  installApp: string;
  installAppDescription: string;
  offlineMode: string;
  encoding: string;
  delimiter: string;
  autoDetect: string;
  confirmDeleteProject: string;
  confirmClearProjects: string;
}

const EN: WorkspaceCopy = {
  projects: "Local projects",
  projectsDescription: "Save comparison settings locally and optionally keep the list data on this device.",
  noProjects: "No saved projects yet",
  saveProject: "Save project",
  projectName: "Project name",
  projectNamePlaceholder: "e.g. Weekly inventory check",
  saveContent: "Save list contents on this device",
  saveContentDescription: "Optional. Content is stored only in this browser using local storage and never uploaded.",
  settingsOnly: "Settings and summary only",
  localOnly: "Only on this device",
  save: "Save",
  saved: "Project saved",
  open: "Open",
  pin: "Pin",
  unpin: "Unpin",
  exportProject: "Export project",
  importProject: "Import project",
  importFailed: "This project file could not be imported.",
  compareNewVersion: "Compare a new version",
  compareNewVersionDescription: "Keep List A as the baseline, clear List B, and reuse the current rules.",
  baselineKept: "Baseline and rules kept. Add the new version to List B.",
  recent: "Recent projects",
  contentSaved: "Restorable content",
  contentNotSaved: "Settings only",
  updatedJustNow: "Updated just now",
  clearAll: "Clear all",
  close: "Close",
  delete: "Delete",
  cancel: "Cancel",
  activity: "Recent activity",
  emptyActivity: "No comparison activity yet",
  showChart: "Show chart",
  hideChart: "Hide chart",
  addedRows: "Added rows",
  removedRows: "Removed rows",
  changedRows: "Changed rows",
  unchangedRows: "Unchanged rows",
  allRows: "All row details",
  noRows: "No rows in this category",
  exportReport: "Export row report",
  previewData: "Preview data",
  hidePreview: "Hide preview",
  detectedEncoding: "Encoding: {encoding}",
  supportedFileTypes: "Use TXT, CSV, TSV, XLSX, XLS, XLSM, or ODS.",
  fileParsingFailed: "This file could not be parsed. Check its format or export it again.",
  compareRules: "Comparison rules",
  columnMapping: "Column mapping",
  autoMap: "Auto-map columns",
  ignoreColumn: "Ignore this column",
  numericTolerance: "Numeric tolerance",
  normalizeDates: "Normalize date formats",
  emptyValuesEqual: "Treat blank, null, N/A, and dash as empty",
  ignorePunctuation: "Ignore punctuation differences",
  recommendedKey: "Recommended key",
  rememberRules: "Remember rules",
  rulesSaved: "Rules saved on this device",
  exportExcel: "Excel report",
  exportCsv: "CSV report",
  filterRows: "Filter results",
  copyFiltered: "Copy filtered rows",
  acceptMatch: "Accept",
  rejectMatch: "Reject",
  matchAccepted: "Accepted",
  matchRejected: "Rejected",
  reviewMatches: "Review suggested matches before exporting the final result.",
  templates: "Scenario template",
  customTemplate: "Custom rules",
  templateApplied: "Template applied. Add your two data versions.",
  shareProject: "Share workspace",
  shareDialogDescription: "Create a self-contained link. No data is uploaded by CompareList.",
  includeShareContent: "Include both list contents in the link",
  sharePrivacyWarning: "Anyone with this link can read the embedded list contents. Do not include sensitive or personal data.",
  shareRulesOnly: "Recommended for sensitive data. The link contains rules only and opens an empty workspace.",
  shareCopied: "Link copied",
  shareTooLarge: "The content is too large for a reliable link. Export a .comparelist project instead.",
  copyShareLink: "Copy link",
  sharedWorkspaceLoaded: "Shared workspace loaded locally. Run the comparison when ready.",
  installApp: "Install",
  installAppDescription: "Install CompareList for faster offline access.",
  offlineMode: "Offline mode: comparisons still run on this device.",
  encoding: "Encoding",
  delimiter: "Delimiter",
  autoDetect: "Auto",
  confirmDeleteProject: "Delete this local project? This cannot be undone.",
  confirmClearProjects: "Delete all local projects? This cannot be undone.",
};

const COPY: Record<string, Partial<WorkspaceCopy>> = {
  en: EN,
  zh: {
    compareRules: "比较规则",
    columnMapping: "列映射",
    autoMap: "自动映射列",
    ignoreColumn: "忽略此列",
    numericTolerance: "数值误差范围",
    normalizeDates: "统一日期格式",
    emptyValuesEqual: "将空白、null、N/A 和横线视为空值",
    ignorePunctuation: "忽略标点符号差异",
    recommendedKey: "推荐主键",
    rememberRules: "记住规则",
    rulesSaved: "规则已保存在此设备",
    exportExcel: "Excel 报告",
    exportCsv: "CSV 报告",
    filterRows: "筛选结果",
    copyFiltered: "复制筛选结果",
    acceptMatch: "接受",
    rejectMatch: "拒绝",
    matchAccepted: "已接受",
    matchRejected: "已拒绝",
    reviewMatches: "请在导出最终结果前确认智能匹配建议。",
    templates: "场景模板",
    customTemplate: "自定义规则",
    templateApplied: "模板已应用，请添加两个数据版本。",
    shareProject: "分享工作区",
    shareDialogDescription: "生成自包含链接，CompareList 不会上传任何数据。",
    includeShareContent: "在链接中包含两个列表的内容",
    sharePrivacyWarning: "任何获得链接的人都能读取其中的列表内容，请勿包含敏感或个人数据。",
    shareRulesOnly: "敏感数据建议使用此方式。链接只包含规则，打开后是空白工作区。",
    shareCopied: "链接已复制",
    shareTooLarge: "内容过大，无法生成可靠链接，请改为导出 .comparelist 项目文件。",
    copyShareLink: "复制链接",
    sharedWorkspaceLoaded: "共享工作区已在本地载入，准备好后即可开始比较。",
    installApp: "安装",
    installAppDescription: "安装 CompareList，以便更快地离线使用。",
    offlineMode: "离线模式：比较仍会在此设备上正常运行。",
    encoding: "编码",
    delimiter: "分隔符",
    autoDetect: "自动识别",
    confirmDeleteProject: "确定删除这个本地项目吗？此操作无法撤销。",
    confirmClearProjects: "确定删除全部本地项目吗？此操作无法撤销。",
    projects: "本地项目",
    projectsDescription: "在本机保存比较规则，并可选择是否保存列表内容。",
    noProjects: "还没有保存的项目",
    saveProject: "保存项目",
    projectName: "项目名称",
    projectNamePlaceholder: "例如：每周库存核对",
    saveContent: "在此设备保存列表内容",
    saveContentDescription: "可选。内容只保存在当前浏览器中，不会上传。",
    settingsOnly: "仅保存规则与摘要",
    localOnly: "仅限此设备",
    save: "保存",
    saved: "项目已保存",
    open: "打开",
    pin: "置顶",
    unpin: "取消置顶",
    exportProject: "导出项目",
    importProject: "导入项目",
    importFailed: "无法导入此项目文件。",
    compareNewVersion: "比较新版本",
    compareNewVersionDescription: "保留列表 A 作为基准，清空列表 B，并复用当前规则。",
    baselineKept: "已保留基准和规则，请将新版本添加到列表 B。",
    recent: "最近项目",
    contentSaved: "可恢复内容",
    contentNotSaved: "仅保存规则",
    updatedJustNow: "刚刚更新",
    clearAll: "清空全部",
    close: "关闭",
    delete: "删除",
    cancel: "取消",
    activity: "最近活动",
    emptyActivity: "暂无比较活动",
    showChart: "显示图表",
    hideChart: "隐藏图表",
    addedRows: "新增记录",
    removedRows: "删除记录",
    changedRows: "修改记录",
    unchangedRows: "未变记录",
    allRows: "全部行级明细",
    noRows: "此分类暂无记录",
    exportReport: "导出行级报告",
    previewData: "预览数据",
    hidePreview: "收起预览",
    detectedEncoding: "编码：{encoding}",
    supportedFileTypes: "支持 TXT、CSV、TSV、XLSX、XLS、XLSM 或 ODS。",
    fileParsingFailed: "无法解析此文件，请检查格式或重新导出。",
  },
  ja: {
    ...EN,
    projects: "ローカルプロジェクト",
    projectsDescription: "比較設定を端末に保存し、必要に応じてリスト内容も保存できます。",
    noProjects: "保存済みプロジェクトはありません",
    saveProject: "プロジェクトを保存",
    projectName: "プロジェクト名",
    saveContent: "この端末にリスト内容を保存",
    save: "保存",
    saved: "保存しました",
    open: "開く",
    compareNewVersion: "新しいバージョンと比較",
    baselineKept: "基準とルールを保持しました。リストBに新しいバージョンを追加してください。",
    contentSaved: "復元可能",
    contentNotSaved: "設定のみ",
  },
  es: {
    ...EN,
    projects: "Proyectos locales",
    projectsDescription: "Guarda la configuración localmente y, si quieres, también los datos de las listas.",
    noProjects: "Aún no hay proyectos guardados",
    saveProject: "Guardar proyecto",
    projectName: "Nombre del proyecto",
    saveContent: "Guardar el contenido en este dispositivo",
    save: "Guardar",
    saved: "Proyecto guardado",
    open: "Abrir",
    compareNewVersion: "Comparar una versión nueva",
    baselineKept: "Se conservaron la referencia y las reglas. Añade la nueva versión a la lista B.",
    contentSaved: "Contenido recuperable",
    contentNotSaved: "Solo configuración",
  },
  fr: {
    ...EN,
    projects: "Projets locaux",
    projectsDescription: "Enregistrez les réglages localement et, si vous le souhaitez, le contenu des listes.",
    noProjects: "Aucun projet enregistré",
    saveProject: "Enregistrer le projet",
    projectName: "Nom du projet",
    saveContent: "Enregistrer le contenu sur cet appareil",
    save: "Enregistrer",
    saved: "Projet enregistré",
    open: "Ouvrir",
    compareNewVersion: "Comparer une nouvelle version",
    baselineKept: "La référence et les règles sont conservées. Ajoutez la nouvelle version à la liste B.",
    contentSaved: "Contenu récupérable",
    contentNotSaved: "Réglages uniquement",
  },
  de: {
    ...EN,
    projects: "Lokale Projekte",
    projectsDescription: "Vergleichsregeln lokal speichern und optional auch die Listendaten behalten.",
    noProjects: "Noch keine Projekte gespeichert",
    saveProject: "Projekt speichern",
    projectName: "Projektname",
    saveContent: "Listeninhalte auf diesem Gerät speichern",
    save: "Speichern",
    saved: "Projekt gespeichert",
    open: "Öffnen",
    compareNewVersion: "Neue Version vergleichen",
    baselineKept: "Basis und Regeln wurden beibehalten. Fügen Sie die neue Version in Liste B ein.",
    contentSaved: "Wiederherstellbarer Inhalt",
    contentNotSaved: "Nur Einstellungen",
  },
};

export function getWorkspaceCopy(locale: string): WorkspaceCopy {
  return { ...EN, ...(COPY[locale] ?? {}) };
}
