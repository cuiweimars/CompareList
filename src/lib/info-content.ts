import type { Locale } from "@/i18n/routing";

interface Section {
  title: string;
  body: string;
}

interface InfoContent {
  title: string;
  description: string;
  intro: string;
  sections: Section[];
}

export const aboutContent: Record<Locale, InfoContent> = {
  en: {
    title: "About CompareList",
    description: "Learn why CompareList exists and how its private, browser-based comparison tools are designed.",
    intro: "CompareList is a free toolkit for finding matches and differences between lists without sending the list contents to a server.",
    sections: [
      { title: "Why we built it", body: "List comparison is a common task in operations, marketing, data cleanup, SEO, and software work. CompareList turns that repetitive work into a clear workflow that anyone can use." },
      { title: "Local by design", body: "Exact comparison, smart similarity matching, file parsing, and export run in your browser. This improves response time and keeps the compared values on your device." },
      { title: "Useful over flashy", body: "We focus on correct parsing, explainable results, practical normalization controls, accessible exports, and guides that help people solve real comparison tasks." },
    ],
  },
  zh: {
    title: "关于 CompareList",
    description: "了解 CompareList 的设计初衷，以及它如何在浏览器本地提供私密的列表比较工具。",
    intro: "CompareList 是一套免费的列表匹配与差异查找工具，列表内容无需发送到服务器。",
    sections: [
      { title: "为什么做这个工具", body: "列表比较广泛用于运营、营销、数据清洗、SEO 和软件开发。CompareList 将重复操作整理成清晰、易用的工作流程。" },
      { title: "本地处理优先", body: "精确比较、智能相似匹配、文件解析和导出都在浏览器中完成，响应更快，也让比较内容保留在您的设备上。" },
      { title: "实用优先", body: "我们重视正确解析、可解释结果、实用归一化选项、便捷导出，以及真正帮助用户解决问题的指南。" },
    ],
  },
  ja: {
    title: "CompareListについて",
    description: "CompareListの目的と、ブラウザ内で安全に動作する比較ツールの設計方針をご紹介します。",
    intro: "CompareListは、リスト内容をサーバーへ送信せずに一致項目と差分を見つける無料ツールです。",
    sections: [
      { title: "開発した理由", body: "リスト比較は運用、マーケティング、データ整理、SEO、開発で繰り返し発生します。CompareListはその作業を誰でも使える明確な手順にします。" },
      { title: "ローカル処理", body: "完全一致、スマート一致、ファイル解析、エクスポートはブラウザ内で動作します。高速で、比較データは端末内に保たれます。" },
      { title: "実用性を重視", body: "正確な解析、説明可能な結果、実用的な正規化設定、使いやすい出力、役立つガイドを重視しています。" },
    ],
  },
  es: {
    title: "Acerca de CompareList",
    description: "Descubre por qué existe CompareList y cómo se diseñan sus herramientas privadas de comparación en el navegador.",
    intro: "CompareList es un conjunto gratuito de herramientas para encontrar coincidencias y diferencias sin enviar el contenido de las listas a un servidor.",
    sections: [
      { title: "Por qué lo creamos", body: "Comparar listas es habitual en operaciones, marketing, limpieza de datos, SEO y desarrollo. CompareList convierte ese trabajo repetitivo en un flujo claro y accesible." },
      { title: "Procesamiento local", body: "La comparación exacta, la coincidencia inteligente, la lectura de archivos y la exportación se ejecutan en tu navegador, manteniendo los valores en tu dispositivo." },
      { title: "Utilidad primero", body: "Priorizamos el análisis correcto, resultados explicables, controles prácticos de normalización, exportaciones accesibles y guías útiles." },
    ],
  },
  fr: {
    title: "À propos de CompareList",
    description: "Découvrez la raison d'être de CompareList et la conception privée de ses outils de comparaison dans le navigateur.",
    intro: "CompareList est une boîte à outils gratuite pour trouver les correspondances et différences sans envoyer le contenu des listes à un serveur.",
    sections: [
      { title: "Pourquoi cet outil", body: "La comparaison de listes revient souvent en opérations, marketing, nettoyage de données, SEO et développement. CompareList la transforme en un flux clair et accessible." },
      { title: "Traitement local", body: "La comparaison exacte, la correspondance intelligente, la lecture des fichiers et l'export s'exécutent dans votre navigateur. Les valeurs restent sur votre appareil." },
      { title: "L'utilité d'abord", body: "Nous privilégions une analyse correcte, des résultats explicables, des réglages pratiques, des exports accessibles et des guides réellement utiles." },
    ],
  },
  de: {
    title: "Über CompareList",
    description: "Erfahren Sie, warum CompareList entwickelt wurde und wie die privaten Vergleichswerkzeuge im Browser funktionieren.",
    intro: "CompareList ist ein kostenloses Werkzeug, das Übereinstimmungen und Unterschiede findet, ohne Listeninhalte an einen Server zu senden.",
    sections: [
      { title: "Warum wir es entwickelt haben", body: "Listenvergleiche gehören zu Betrieb, Marketing, Datenbereinigung, SEO und Entwicklung. CompareList macht diese wiederkehrende Arbeit zu einem klaren Ablauf." },
      { title: "Lokale Verarbeitung", body: "Exakter Vergleich, intelligenter Abgleich, Dateiverarbeitung und Export laufen im Browser. Die verglichenen Werte bleiben auf Ihrem Gerät." },
      { title: "Nutzen vor Effekten", body: "Im Mittelpunkt stehen korrektes Einlesen, erklärbare Ergebnisse, praktische Normalisierung, zugängliche Exporte und hilfreiche Anleitungen." },
    ],
  },
};

export const privacyContent: Record<Locale, InfoContent> = {
  en: {
    title: "Privacy Policy",
    description: "How CompareList processes list data, local history, files, and optional analytics.",
    intro: "Effective July 19, 2026. CompareList is designed to minimize data collection and keep comparison data on your device.",
    sections: [
      { title: "List and file processing", body: "Text, CSV, TSV, and Excel data are parsed and compared in your browser. Exact and Smart Match results are not transmitted to CompareList servers." },
      { title: "Local history", body: "New history entries store only counts, match rate, mode, and time in your browser's local storage. They do not store list contents. You can delete individual records or clear all history at any time." },
      { title: "Analytics", body: "If site analytics are enabled, Google Analytics may receive standard usage information such as page paths, device type, and approximate region. List values, uploaded file contents, and comparison results are never added to analytics events." },
      { title: "Accounts, payments, and cloud AI", body: "CompareList currently has no user accounts, payment flow, or cloud AI comparison. Smart Match is a deterministic similarity algorithm that runs locally." },
      { title: "Your choices", body: "You can block analytics with browser controls, clear local storage, or use a private browsing session. Policy changes will be published on this page with a new effective date." },
    ],
  },
  zh: {
    title: "隐私政策",
    description: "了解 CompareList 如何处理列表数据、本地历史、文件和可选的网站分析。",
    intro: "生效日期：2026 年 7 月 19 日。CompareList 以最少收集数据、让比较内容留在您的设备上为设计原则。",
    sections: [
      { title: "列表与文件处理", body: "文本、CSV、TSV 和 Excel 数据均在浏览器中解析和比较。精确匹配与智能匹配的内容和结果不会传输到 CompareList 服务器。" },
      { title: "本地历史记录", body: "新的历史记录只在浏览器本地存储中保存数量、匹配率、模式和时间，不保存列表内容。您可以删除单条记录或随时清空历史。" },
      { title: "网站分析", body: "若启用 Google Analytics，可能会收集页面路径、设备类型和大致地区等常规使用信息。列表值、上传文件内容和比较结果不会加入分析事件。" },
      { title: "账户、支付与云端 AI", body: "CompareList 目前没有用户账户、支付流程或云端 AI 比较。智能匹配是完全在本地运行的确定性相似度算法。" },
      { title: "您的选择", body: "您可以通过浏览器设置拦截分析、清除本地存储，或使用隐私浏览。政策变更会在本页更新生效日期后公布。" },
    ],
  },
  ja: {
    title: "プライバシーポリシー",
    description: "CompareListにおけるリスト、ローカル履歴、ファイル、任意のアクセス解析の扱い。",
    intro: "2026年7月19日施行。CompareListはデータ収集を最小限にし、比較データを端末内に保つよう設計されています。",
    sections: [
      { title: "リストとファイル", body: "テキスト、CSV、TSV、Excelはブラウザ内で解析・比較されます。完全一致とスマート一致の内容・結果はサーバーへ送信されません。" },
      { title: "ローカル履歴", body: "新しい履歴には件数、一致率、モード、時刻のみがブラウザのローカルストレージに保存され、リスト内容は保存されません。いつでも削除できます。" },
      { title: "アクセス解析", body: "Google Analyticsが有効な場合、ページパス、端末種別、おおよその地域などが送信されることがあります。リスト値、ファイル内容、比較結果は解析イベントに含めません。" },
      { title: "アカウント・決済・クラウドAI", body: "現在、アカウント、決済、クラウドAI比較はありません。スマート一致はローカルで動作する決定的な類似度アルゴリズムです。" },
      { title: "選択肢", body: "ブラウザ設定で解析を拒否し、ローカルストレージを消去し、プライベートブラウズを利用できます。変更時は施行日を更新します。" },
    ],
  },
  es: {
    title: "Política de privacidad",
    description: "Cómo procesa CompareList los datos de listas, el historial local, los archivos y las analíticas opcionales.",
    intro: "Vigente desde el 19 de julio de 2026. CompareList minimiza la recopilación y mantiene los datos de comparación en tu dispositivo.",
    sections: [
      { title: "Listas y archivos", body: "El texto, CSV, TSV y Excel se procesan en el navegador. El contenido y los resultados de la comparación exacta e inteligente no se transmiten a servidores de CompareList." },
      { title: "Historial local", body: "El historial nuevo guarda solo conteos, tasa de coincidencia, modo y hora en el almacenamiento local. No guarda las listas y puede borrarse en cualquier momento." },
      { title: "Analíticas", body: "Si Google Analytics está activo, puede recibir rutas de página, tipo de dispositivo y región aproximada. Los valores, archivos y resultados nunca se añaden a eventos analíticos." },
      { title: "Cuentas, pagos e IA en la nube", body: "Actualmente no hay cuentas, pagos ni comparación con IA en la nube. La coincidencia inteligente es un algoritmo determinista local." },
      { title: "Tus opciones", body: "Puedes bloquear las analíticas, borrar el almacenamiento local o usar navegación privada. Los cambios se publicarán aquí con una nueva fecha." },
    ],
  },
  fr: {
    title: "Politique de confidentialité",
    description: "Comment CompareList traite les listes, l'historique local, les fichiers et les statistiques facultatives.",
    intro: "En vigueur le 19 juillet 2026. CompareList limite la collecte et conserve les données de comparaison sur votre appareil.",
    sections: [
      { title: "Listes et fichiers", body: "Les textes, CSV, TSV et Excel sont traités dans le navigateur. Le contenu et les résultats des comparaisons exacte et intelligente ne sont pas transmis aux serveurs CompareList." },
      { title: "Historique local", body: "Le nouvel historique conserve seulement les nombres, le taux, le mode et l'heure dans le stockage local. Il ne conserve pas les listes et peut être effacé à tout moment." },
      { title: "Statistiques", body: "Si Google Analytics est activé, il peut recevoir les chemins de pages, le type d'appareil et une région approximative. Les valeurs, fichiers et résultats ne sont jamais ajoutés aux événements." },
      { title: "Comptes, paiements et IA cloud", body: "Il n'existe actuellement ni compte, ni paiement, ni comparaison IA dans le cloud. La correspondance intelligente est un algorithme déterministe local." },
      { title: "Vos choix", body: "Vous pouvez bloquer les statistiques, effacer le stockage local ou utiliser la navigation privée. Les changements seront publiés ici avec une nouvelle date." },
    ],
  },
  de: {
    title: "Datenschutzerklärung",
    description: "Wie CompareList Listen, lokalen Verlauf, Dateien und optionale Nutzungsanalyse verarbeitet.",
    intro: "Gültig ab 19. Juli 2026. CompareList minimiert die Datenerfassung und hält Vergleichsdaten auf Ihrem Gerät.",
    sections: [
      { title: "Listen und Dateien", body: "Text-, CSV-, TSV- und Excel-Daten werden im Browser verarbeitet. Inhalte und Ergebnisse des exakten und intelligenten Vergleichs werden nicht an CompareList-Server übertragen." },
      { title: "Lokaler Verlauf", body: "Neue Einträge speichern nur Anzahlen, Trefferquote, Modus und Zeit im lokalen Browserspeicher. Listeninhalte werden nicht gespeichert; der Verlauf kann jederzeit gelöscht werden." },
      { title: "Nutzungsanalyse", body: "Falls Google Analytics aktiv ist, können Seitenpfade, Gerätetyp und ungefähre Region erfasst werden. Listenwerte, Dateiinhalte und Ergebnisse werden nie in Analyseereignisse aufgenommen." },
      { title: "Konten, Zahlungen und Cloud-KI", body: "Derzeit gibt es keine Konten, Zahlungen oder Cloud-KI-Vergleiche. Der intelligente Abgleich ist ein lokaler, deterministischer Ähnlichkeitsalgorithmus." },
      { title: "Ihre Wahl", body: "Sie können Analysen blockieren, lokalen Speicher löschen oder privat surfen. Änderungen werden hier mit einem neuen Gültigkeitsdatum veröffentlicht." },
    ],
  },
};
