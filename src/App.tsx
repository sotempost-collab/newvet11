import { useState, useEffect } from 'react';
import { 
  PawPrint, LogIn, Eye, EyeOff, Zap, RefreshCw, Info, 
  FileText, Activity, Stethoscope, ClipboardList, ChevronRight,
  ChevronLeft, Save, AlertTriangle, CheckCircle, X, Menu,
  Home, BookOpen, User
} from 'lucide-react';
import { 
  PATHOLOGIES, NORMS, ANAMNESIS_FIELDS, EXAM_SECTIONS, 
  SEVERITY_COLORS, SEVERITY_LABELS,
  Pathology 
} from './data';

type Page = 'login' | 'dashboard' | 'exam' | 'pathologies' | 'norms' | 'history';
type ExamStep = 'patient' | 'anamnesis' | 'exam' | 'pathologies' | 'summary';

interface PatientInfo {
  name: string;
  species: string;
  breed: string;
  age: string;
  sex: string;
  weight: string;
  owner: string;
  ownerPhone: string;
}

interface ExamData {
  patient: PatientInfo;
  anamnesis: Record<string, string>;
  exam: Record<string, string>;
  selectedPathologies: string[];
  notes: string;
  date: string;
}

function App() {
  const [page, setPage] = useState<Page>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [examStep, setExamStep] = useState<ExamStep>('patient');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPathology, setSelectedPathology] = useState<Pathology | null>(null);
  const [examData, setExamData] = useState<ExamData>({
    patient: { name: '', species: '', breed: '', age: '', sex: '', weight: '', owner: '', ownerPhone: '' },
    anamnesis: {},
    exam: {},
    selectedPathologies: [],
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [savedExams, setSavedExams] = useState<ExamData[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ushi-exams');
    if (saved) setSavedExams(JSON.parse(saved));
    const logged = localStorage.getItem('ushi-logged');
    if (logged === 'true') { setIsLoggedIn(true); setPage('dashboard'); }
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if ((username === 'admin' && password === 'admin') || (!username && !password)) {
      setIsLoggedIn(true);
      localStorage.setItem('ushi-logged', 'true');
      setPage('dashboard');
      showNotification('Добро пожаловать! 🐾');
    } else {
      showNotification('Неверный логин или пароль');
    }
  };

  const handleQuickLogin = () => {
    setUsername('admin');
    setPassword('admin');
  };

  const handleAutoFill = () => {
    setUsername('admin');
    setPassword('admin');
  };

  const handleReset = () => {
    localStorage.removeItem('ushi-logged');
    setUsername('');
    setPassword('');
    setIsLoggedIn(false);
    setPage('login');
    showNotification('Данные сброшены');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('ushi-logged');
    setPage('login');
    setMenuOpen(false);
  };

  const updateExamData = (field: string, value: string | string[]) => {
    setExamData(prev => ({ ...prev, [field]: value }));
  };

  const updatePatient = (field: keyof PatientInfo, value: string) => {
    setExamData(prev => ({ ...prev, patient: { ...prev.patient, [field]: value } }));
  };

  const updateAnamnesis = (field: string, value: string) => {
    setExamData(prev => ({ ...prev, anamnesis: { ...prev.anamnesis, [field]: value } }));
  };

  const updateExam = (field: string, value: string) => {
    setExamData(prev => ({ ...prev, exam: { ...prev.exam, [field]: value } }));
  };

  const togglePathology = (id: string) => {
    setExamData(prev => {
      const selected = prev.selectedPathologies.includes(id)
        ? prev.selectedPathologies.filter(p => p !== id)
        : [...prev.selectedPathologies, id];
      return { ...prev, selectedPathologies: selected };
    });
  };

  const saveExam = () => {
    const newExams = [...savedExams, examData];
    setSavedExams(newExams);
    localStorage.setItem('ushi-exams', JSON.stringify(newExams));
    showNotification('Осмотр сохранён ✅');
    setExamData({
      patient: { name: '', species: '', breed: '', age: '', sex: '', weight: '', owner: '', ownerPhone: '' },
      anamnesis: {},
      exam: {},
      selectedPathologies: [],
      notes: '',
      date: new Date().toISOString().split('T')[0]
    });
    setExamStep('patient');
    setPage('dashboard');
  };

  const newExam = () => {
    setExamData({
      patient: { name: '', species: '', breed: '', age: '', sex: '', weight: '', owner: '', ownerPhone: '' },
      anamnesis: {},
      exam: {},
      selectedPathologies: [],
      notes: '',
      date: new Date().toISOString().split('T')[0]
    });
    setExamStep('patient');
    setPage('exam');
    setMenuOpen(false);
  };

  // LOGIN PAGE
  if (page === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50 p-4 safe-area-top">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/30">
              <PawPrint className="h-12 w-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-emerald-800">Ассистент УшиХвост</h1>
              <p className="text-sm text-gray-500 mt-1">Войдите для доступа к ветеринарному приложению</p>
            </div>
          </div>

          <div className="bg-white flex flex-col gap-6 rounded-xl border py-6 border-emerald-200 shadow-lg">
            <div className="px-6 space-y-1.5">
              <div className="font-semibold flex items-center gap-2 text-emerald-800">
                <LogIn className="h-5 w-5" />
                Вход в систему
              </div>
              <p className="text-gray-500 text-sm">Введите ваши учётные данные для продолжения</p>
            </div>

            <div className="px-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 font-medium text-xs text-gray-700" htmlFor="username">Логин</label>
                  <input
                    id="username"
                    className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-base focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                    placeholder="admin"
                    autoComplete="username"
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 font-medium text-xs text-gray-700" htmlFor="password">Пароль</label>
                  <div className="relative">
                    <input
                      id="password"
                      className="w-full rounded-md border border-gray-300 px-3 py-2.5 pr-11 text-base focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="w-full h-11 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm flex items-center justify-center gap-2 transition shadow-sm">
                  <LogIn className="h-4 w-4" />
                  Войти
                </button>
                <button type="button" onClick={handleQuickLogin} className="w-full h-11 rounded-md border border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-medium text-sm flex items-center justify-center gap-2 transition">
                  <Zap className="h-4 w-4" />
                  Быстрый вход: admin / admin
                </button>
              </form>

              <div className="mt-4 p-3 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-2">
                <div className="font-medium flex items-center gap-1">
                  <Info className="h-3.5 w-3.5" />
                  Учётная запись по умолчанию:
                </div>
                <div className="font-mono bg-amber-100 p-1.5 rounded text-center text-sm">
                  Логин: <strong>admin</strong> · Пароль: <strong>admin</strong>
                </div>
                <button onClick={handleAutoFill} className="text-emerald-700 hover:text-emerald-900 underline">
                  Заполнить форму автоматически
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-amber-200">
                <p className="text-xs text-gray-500 mb-2">Не входит? Возможно, пароль был изменён ранее. Сбросьте данные аккаунта, чтобы вернуть пароль по умолчанию (admin/admin).</p>
                <button onClick={handleReset} className="text-xs text-rose-700 hover:text-rose-900 underline flex items-center gap-1 mx-auto">
                  <RefreshCw className="h-3.5 w-3.5" />
                  Сбросить данные аккаунта
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500">
            🐾 Данные аккаунтов хранятся локально на этом устройстве.<br />
            Для командной работы нужен общий сервер — пока работает на одном устройстве.
          </p>
        </div>
      </div>
    );
  }

  // HEADER COMPONENT
  const Header = () => (
    <header className="bg-white border-b border-emerald-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-lg hover:bg-emerald-50 transition">
            <Menu className="h-5 w-5 text-emerald-700" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
              <PawPrint className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-emerald-800 text-lg hidden sm:block">УшиХвост</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={newExam} className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium flex items-center gap-1.5 transition shadow-sm">
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">Новый осмотр</span>
          </button>
          <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition" title="Выйти">
            <LogIn className="h-5 w-5 rotate-180" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-emerald-200 shadow-lg animate-fade-in z-50">
          <nav className="max-w-6xl mx-auto px-4 py-3 space-y-1">
            <button onClick={() => { setPage('dashboard'); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-emerald-50 text-left text-sm text-gray-700">
              <Home className="h-4 w-4 text-emerald-600" /> Главная
            </button>
            <button onClick={() => { newExam(); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-emerald-50 text-left text-sm text-gray-700">
              <Stethoscope className="h-4 w-4 text-emerald-600" /> Новый осмотр
            </button>
            <button onClick={() => { setPage('pathologies'); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-emerald-50 text-left text-sm text-gray-700">
              <AlertTriangle className="h-4 w-4 text-emerald-600" /> Патологии
            </button>
            <button onClick={() => { setPage('norms'); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-emerald-50 text-left text-sm text-gray-700">
              <BookOpen className="h-4 w-4 text-emerald-600" /> Нормы
            </button>
            <button onClick={() => { setPage('history'); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-emerald-50 text-left text-sm text-gray-700">
              <FileText className="h-4 w-4 text-emerald-600" /> История осмотров
            </button>
            <hr className="my-2 border-gray-200" />
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 text-left text-sm text-red-600">
              <LogIn className="h-4 w-4 rotate-180" /> Выйти
            </button>
          </nav>
        </div>
      )}
    </header>
  );

  // NOTIFICATION
  const Notification = () => notification ? (
    <div className="fixed top-4 right-4 z-[100] animate-fade-in">
      <div className="bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm">
        <CheckCircle className="h-4 w-4" />
        {notification}
      </div>
    </div>
  ) : null;

  // DASHBOARD
  if (page === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50">
        <Header />
        <Notification />
        <main className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-emerald-800">Добро пожаловать, доктор! 🐾</h2>
            <p className="text-gray-500 text-sm">Ассистент ветеринарного осмотра</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button onClick={newExam} className="bg-white rounded-xl border border-emerald-200 p-5 hover:shadow-md hover:border-emerald-300 transition text-left group">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-3 group-hover:bg-emerald-200 transition">
                <Stethoscope className="h-5 w-5 text-emerald-700" />
              </div>
              <h3 className="font-semibold text-gray-800">Новый осмотр</h3>
              <p className="text-xs text-gray-500 mt-1">Начать осмотр пациента</p>
            </button>

            <button onClick={() => setPage('pathologies')} className="bg-white rounded-xl border border-emerald-200 p-5 hover:shadow-md hover:border-emerald-300 transition text-left group">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mb-3 group-hover:bg-amber-200 transition">
                <AlertTriangle className="h-5 w-5 text-amber-700" />
              </div>
              <h3 className="font-semibold text-gray-800">Патологии</h3>
              <p className="text-xs text-gray-500 mt-1">Справочник заболеваний</p>
            </button>

            <button onClick={() => setPage('norms')} className="bg-white rounded-xl border border-emerald-200 p-5 hover:shadow-md hover:border-emerald-300 transition text-left group">
              <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center mb-3 group-hover:bg-sky-200 transition">
                <BookOpen className="h-5 w-5 text-sky-700" />
              </div>
              <h3 className="font-semibold text-gray-800">Нормы</h3>
              <p className="text-xs text-gray-500 mt-1">Показатели нормы</p>
            </button>

            <button onClick={() => setPage('history')} className="bg-white rounded-xl border border-emerald-200 p-5 hover:shadow-md hover:border-emerald-300 transition text-left group">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3 group-hover:bg-purple-200 transition">
                <FileText className="h-5 w-5 text-purple-700" />
              </div>
              <h3 className="font-semibold text-gray-800">История</h3>
              <p className="text-xs text-gray-500 mt-1">Сохранённые осмотры ({savedExams.length})</p>
            </button>
          </div>

          {/* Quick stats */}
          <div className="bg-white rounded-xl border border-emerald-200 p-5">
            <h3 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
              <Activity className="h-5 w-5" /> Быстрая статистика
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-emerald-50">
                <div className="text-2xl font-bold text-emerald-700">{savedExams.length}</div>
                <div className="text-xs text-gray-500">Осмотров</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-amber-50">
                <div className="text-2xl font-bold text-amber-700">{PATHOLOGIES.length}</div>
                <div className="text-xs text-gray-500">Патологий</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-sky-50">
                <div className="text-2xl font-bold text-sky-700">{NORMS.length}</div>
                <div className="text-xs text-gray-500">Параметров нормы</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-purple-50">
                <div className="text-2xl font-bold text-purple-700">{ANAMNESIS_FIELDS.length}</div>
                <div className="text-xs text-gray-500">Полей анамнеза</div>
              </div>
            </div>
          </div>

          {/* Recent exams */}
          {savedExams.length > 0 && (
            <div className="bg-white rounded-xl border border-emerald-200 p-5">
              <h3 className="font-semibold text-emerald-800 mb-3">Последние осмотры</h3>
              <div className="space-y-2">
                {savedExams.slice(-3).reverse().map((exam, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div>
                      <div className="font-medium text-gray-800 text-sm">
                        {exam.patient.name || 'Без имени'} — {exam.patient.species || 'Не указан'}
                      </div>
                      <div className="text-xs text-gray-500">{exam.date} · {exam.selectedPathologies.length} патологий</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // PATHOLOGIES PAGE
  if (page === 'pathologies') {
    const categories = [...new Set(PATHOLOGIES.map(p => p.category))];
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50">
        <Header />
        <Notification />
        <main className="max-w-6xl mx-auto px-4 py-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-emerald-800 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6" /> Справочник патологий
              </h2>
              <p className="text-sm text-gray-500 mt-1">{PATHOLOGIES.length} заболеваний в {categories.length} категориях</p>
            </div>
            <button onClick={() => setPage('dashboard')} className="p-2 rounded-lg hover:bg-emerald-100 transition">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {selectedPathology ? (
            <div className="bg-white rounded-xl border border-emerald-200 p-6 animate-slide-up">
              <button onClick={() => setSelectedPathology(null)} className="flex items-center gap-1 text-sm text-emerald-700 hover:text-emerald-900 mb-4">
                <ChevronLeft className="h-4 w-4" /> Назад к списку
              </button>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedPathology.name}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{selectedPathology.category}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${SEVERITY_COLORS[selectedPathology.severity].bg} ${SEVERITY_COLORS[selectedPathology.severity].text}`}>
                    {SEVERITY_LABELS[selectedPathology.severity]}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 text-sm mb-1">Описание</h4>
                  <p className="text-gray-600 text-sm">{selectedPathology.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 text-sm mb-2">Симптомы</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPathology.symptoms.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 bg-red-50 text-red-700 text-xs rounded-full border border-red-200">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 text-sm mb-1">Лечение</h4>
                  <p className="text-gray-600 text-sm">{selectedPathology.treatment}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {categories.map(cat => (
                <div key={cat} className="bg-white rounded-xl border border-emerald-200 overflow-hidden">
                  <div className="px-5 py-3 bg-emerald-50 border-b border-emerald-100">
                    <h3 className="font-semibold text-emerald-800">{cat}</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {PATHOLOGIES.filter(p => p.category === cat).map(path => (
                      <button key={path.id} onClick={() => setSelectedPathology(path)} className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition text-left">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${SEVERITY_COLORS[path.severity].dot}`} />
                          <div>
                            <div className="font-medium text-gray-800 text-sm">{path.name}</div>
                            <div className="text-xs text-gray-500">{path.symptoms.slice(0, 3).join(' · ')}</div>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  // NORMS PAGE
  if (page === 'norms') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50">
        <Header />
        <Notification />
        <main className="max-w-6xl mx-auto px-4 py-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-emerald-800 flex items-center gap-2">
                <BookOpen className="h-6 w-6" /> Показатели нормы
              </h2>
              <p className="text-sm text-gray-500 mt-1">Референсные значения для собак и кошек</p>
            </div>
            <button onClick={() => setPage('dashboard')} className="p-2 rounded-lg hover:bg-emerald-100 transition">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-3">
            {NORMS.map(norm => (
              <div key={norm.id} className="bg-white rounded-xl border border-emerald-200 p-4 hover:shadow-sm transition">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 text-sm">{norm.parameter}</h3>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-200 font-medium whitespace-nowrap ml-2">
                    {norm.normal}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{norm.description}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // HISTORY PAGE
  if (page === 'history') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50">
        <Header />
        <Notification />
        <main className="max-w-6xl mx-auto px-4 py-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-emerald-800 flex items-center gap-2">
                <FileText className="h-6 w-6" /> История осмотров
              </h2>
              <p className="text-sm text-gray-500 mt-1">{savedExams.length} сохранённых осмотров</p>
            </div>
            <button onClick={() => setPage('dashboard')} className="p-2 rounded-lg hover:bg-emerald-100 transition">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {savedExams.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Нет сохранённых осмотров</p>
              <button onClick={newExam} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition">
                Создать первый осмотр
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedExams.slice().reverse().map((exam, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-emerald-200 p-4 hover:shadow-sm transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-gray-800">{exam.patient.name || 'Без имени'}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {exam.patient.species} · {exam.patient.breed} · {exam.patient.age} · {exam.date}
                      </div>
                      <div className="text-xs text-gray-500">Владелец: {exam.patient.owner || '—'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-emerald-600 font-medium">{exam.selectedPathologies.length} патологий</div>
                    </div>
                  </div>
                  {exam.selectedPathologies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {exam.selectedPathologies.map(pid => {
                        const p = PATHOLOGIES.find(pp => pp.id === pid);
                        return p ? (
                          <span key={pid} className={`px-2 py-0.5 text-xs rounded-full ${SEVERITY_COLORS[p.severity].bg} ${SEVERITY_COLORS[p.severity].text}`}>
                            {p.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  // EXAM PAGE
  const examSteps: { id: ExamStep; label: string; icon: React.ReactNode }[] = [
    { id: 'patient', label: 'Пациент', icon: <User className="h-4 w-4" /> },
    { id: 'anamnesis', label: 'Анамнез', icon: <ClipboardList className="h-4 w-4" /> },
    { id: 'exam', label: 'Осмотр', icon: <Stethoscope className="h-4 w-4" /> },
    { id: 'pathologies', label: 'Патологии', icon: <AlertTriangle className="h-4 w-4" /> },
    { id: 'summary', label: 'Итог', icon: <FileText className="h-4 w-4" /> },
  ];

  const currentStepIdx = examSteps.findIndex(s => s.id === examStep);

  const goToStep = (step: ExamStep) => {
    setExamStep(step);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50">
      <Header />
      <Notification />
      <main className="max-w-4xl mx-auto px-4 py-4 animate-fade-in">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-6 overflow-x-auto pb-2">
          {examSteps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => goToStep(step.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                step.id === examStep
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : idx < currentStepIdx
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-white text-gray-400 border border-gray-200'
              }`}
            >
              {step.icon}
              <span className="hidden sm:inline">{step.label}</span>
            </button>
          ))}
        </div>

        {/* PATIENT INFO STEP */}
        {examStep === 'patient' && (
          <div className="bg-white rounded-xl border border-emerald-200 p-6 animate-slide-up">
            <h3 className="text-lg font-bold text-emerald-800 mb-4 flex items-center gap-2">
              <User className="h-5 w-5" /> Данные пациента
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-gray-600 mb-1 block">Кличка</label>
                <input type="text" value={examData.patient.name} onChange={e => updatePatient('name', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none" placeholder="Введите кличку..." />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Вид</label>
                <select value={examData.patient.species} onChange={e => updatePatient('species', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none">
                  <option value="">Выберите...</option>
                  <option value="Собака">Собака</option>
                  <option value="Кошка">Кошка</option>
                  <option value="Хорёк">Хорёк</option>
                  <option value="Кролик">Кролик</option>
                  <option value="Другое">Другое</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Порода</label>
                <input type="text" value={examData.patient.breed} onChange={e => updatePatient('breed', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none" placeholder="Порода..." />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Возраст</label>
                <input type="text" value={examData.patient.age} onChange={e => updatePatient('age', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none" placeholder="Напр. 3 года" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Пол</label>
                <select value={examData.patient.sex} onChange={e => updatePatient('sex', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none">
                  <option value="">Выберите...</option>
                  <option value="М">Мужской</option>
                  <option value="Ж">Женский</option>
                  <option value="М (кастр.)">Мужской (кастрирован)</option>
                  <option value="Ж (стер.)">Женский (стерилизована)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Масса (кг)</label>
                <input type="text" value={examData.patient.weight} onChange={e => updatePatient('weight', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none" placeholder="кг" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Владелец</label>
                <input type="text" value={examData.patient.owner} onChange={e => updatePatient('owner', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none" placeholder="ФИО владельца" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Телефон</label>
                <input type="text" value={examData.patient.ownerPhone} onChange={e => updatePatient('ownerPhone', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none" placeholder="+7..." />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => goToStep('anamnesis')} className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition flex items-center gap-2">
                Далее <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ANAMNESIS STEP */}
        {examStep === 'anamnesis' && (
          <div className="bg-white rounded-xl border border-emerald-200 p-6 animate-slide-up">
            <h3 className="text-lg font-bold text-emerald-800 mb-4 flex items-center gap-2">
              <ClipboardList className="h-5 w-5" /> Анамнез
            </h3>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {ANAMNESIS_FIELDS.map(field => (
                <div key={field.id}>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={examData.anamnesis[field.id] || ''}
                      onChange={e => updateAnamnesis(field.id, e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none resize-none"
                      rows={2}
                      placeholder={field.placeholder}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={examData.anamnesis[field.id] || ''}
                      onChange={e => updateAnamnesis(field.id, e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                    >
                      <option value="">Выберите...</option>
                      {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={examData.anamnesis[field.id] || ''}
                      onChange={e => updateAnamnesis(field.id, e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <button onClick={() => goToStep('patient')} className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" /> Назад
              </button>
              <button onClick={() => goToStep('exam')} className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition flex items-center gap-2">
                Далее <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* EXAM STEP */}
        {examStep === 'exam' && (
          <div className="space-y-4 animate-slide-up">
            <div className="bg-white rounded-xl border border-emerald-200 p-6">
              <h3 className="text-lg font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <Stethoscope className="h-5 w-5" /> Объективный осмотр
              </h3>
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                {EXAM_SECTIONS.map(section => (
                  <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                      <h4 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                        <span>{section.icon}</span> {section.title}
                      </h4>
                    </div>
                    <div className="p-4 space-y-3">
                      {section.fields.map(field => (
                        <div key={field.id}>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">{field.label}</label>
                          {'options' in field ? (
                            <select
                              value={examData.exam[field.id] || ''}
                              onChange={e => updateExam(field.id, e.target.value)}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                            >
                              <option value="">Выберите...</option>
                              {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          ) : (
                            <input
                              type="number"
                              value={examData.exam[field.id] || ''}
                              onChange={e => updateExam(field.id, e.target.value)}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                              placeholder="—"
                              step="0.1"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <button onClick={() => goToStep('anamnesis')} className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" /> Назад
              </button>
              <button onClick={() => goToStep('pathologies')} className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition flex items-center gap-2">
                Далее <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* PATHOLOGIES STEP */}
        {examStep === 'pathologies' && (
          <div className="bg-white rounded-xl border border-emerald-200 p-6 animate-slide-up">
            <h3 className="text-lg font-bold text-emerald-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Выбор патологий
            </h3>
            <p className="text-xs text-gray-500 mb-4">Отметьте выявленные патологии при осмотре</p>

            <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-2">
              {[...new Set(PATHOLOGIES.map(p => p.category))].map(cat => (
                <div key={cat}>
                  <h4 className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">{cat}</h4>
                  <div className="space-y-1.5">
                    {PATHOLOGIES.filter(p => p.category === cat).map(path => (
                      <label key={path.id} className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition ${
                        examData.selectedPathologies.includes(path.id)
                          ? 'border-emerald-300 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}>
                        <input
                          type="checkbox"
                          checked={examData.selectedPathologies.includes(path.id)}
                          onChange={() => togglePathology(path.id)}
                          className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-800">{path.name}</div>
                          <div className="text-xs text-gray-500">{path.symptoms.slice(0, 2).join(' · ')}</div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${SEVERITY_COLORS[path.severity].dot}`} title={SEVERITY_LABELS[path.severity]} />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {examData.selectedPathologies.length > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <div className="text-xs font-medium text-amber-800 mb-2">Выбрано ({examData.selectedPathologies.length}):</div>
                <div className="flex flex-wrap gap-1.5">
                  {examData.selectedPathologies.map(pid => {
                    const p = PATHOLOGIES.find(pp => pp.id === pid);
                    return p ? (
                      <span key={pid} className={`px-2 py-0.5 text-xs rounded-full ${SEVERITY_COLORS[p.severity].bg} ${SEVERITY_COLORS[p.severity].text}`}>
                        {p.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            <div className="mt-4">
              <label className="text-xs font-medium text-gray-600 mb-1 block">Заметки врача</label>
              <textarea
                value={examData.notes}
                onChange={e => setExamData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none resize-none"
                rows={3}
                placeholder="Дополнительные заметки, рекомендации..."
              />
            </div>

            <div className="mt-6 flex justify-between">
              <button onClick={() => goToStep('exam')} className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" /> Назад
              </button>
              <button onClick={() => goToStep('summary')} className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition flex items-center gap-2">
                Итог <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* SUMMARY STEP */}
        {examStep === 'summary' && (
          <div className="space-y-4 animate-slide-up">
            <div className="bg-white rounded-xl border border-emerald-200 p-6">
              <h3 className="text-lg font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" /> Итоговый протокол осмотра
              </h3>

              {/* Patient */}
              <div className="mb-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Пациент</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                  <div><span className="text-gray-500">Кличка:</span> <strong>{examData.patient.name || '—'}</strong></div>
                  <div><span className="text-gray-500">Вид:</span> <strong>{examData.patient.species || '—'}</strong></div>
                  <div><span className="text-gray-500">Порода:</span> <strong>{examData.patient.breed || '—'}</strong></div>
                  <div><span className="text-gray-500">Возраст:</span> <strong>{examData.patient.age || '—'}</strong></div>
                  <div><span className="text-gray-500">Пол:</span> <strong>{examData.patient.sex || '—'}</strong></div>
                  <div><span className="text-gray-500">Вес:</span> <strong>{examData.patient.weight ? examData.patient.weight + ' кг' : '—'}</strong></div>
                  <div><span className="text-gray-500">Владелец:</span> <strong>{examData.patient.owner || '—'}</strong></div>
                  <div><span className="text-gray-500">Дата:</span> <strong>{examData.date}</strong></div>
                </div>
              </div>

              {/* Anamnesis summary */}
              {Object.values(examData.anamnesis).some(v => v) && (
                <div className="mb-4 p-3 rounded-lg bg-sky-50 border border-sky-200">
                  <h4 className="text-xs font-semibold text-sky-700 uppercase mb-2">Анамнез</h4>
                  <div className="space-y-1 text-sm">
                    {ANAMNESIS_FIELDS.map(field => {
                      const val = examData.anamnesis[field.id];
                      if (!val) return null;
                      return (
                        <div key={field.id} className="flex gap-2">
                          <span className="text-gray-500 min-w-[140px] text-xs">{field.label}:</span>
                          <span className="text-gray-800 font-medium text-xs">{val}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Exam summary */}
              {Object.values(examData.exam).some(v => v) && (
                <div className="mb-4 p-3 rounded-lg bg-purple-50 border border-purple-200">
                  <h4 className="text-xs font-semibold text-purple-700 uppercase mb-2">Данные осмотра</h4>
                  <div className="space-y-1 text-sm">
                    {EXAM_SECTIONS.map(section => {
                      const sectionData = section.fields.filter(f => examData.exam[f.id]);
                      if (sectionData.length === 0) return null;
                      return (
                        <div key={section.id} className="mb-2">
                          <div className="text-xs font-medium text-gray-600 mb-1">{section.icon} {section.title}</div>
                          {sectionData.map(f => (
                            <div key={f.id} className="flex gap-2 ml-4">
                              <span className="text-gray-500 text-xs">{f.label}:</span>
                              <span className="text-gray-800 text-xs">{examData.exam[f.id]}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pathologies */}
              {examData.selectedPathologies.length > 0 && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                  <h4 className="text-xs font-semibold text-red-700 uppercase mb-2">Выявленные патологии</h4>
                  <div className="space-y-2">
                    {examData.selectedPathologies.map(pid => {
                      const p = PATHOLOGIES.find(pp => pp.id === pid);
                      if (!p) return null;
                      return (
                        <div key={pid} className="border-b border-red-100 pb-2 last:border-0 last:pb-0">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${SEVERITY_COLORS[p.severity].dot}`} />
                            <span className="font-medium text-sm text-gray-800">{p.name}</span>
                            <span className={`px-1.5 py-0.5 text-xs rounded ${SEVERITY_COLORS[p.severity].bg} ${SEVERITY_COLORS[p.severity].text}`}>
                              {SEVERITY_LABELS[p.severity]}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 ml-4">{p.description}</p>
                          <p className="text-xs text-gray-500 mt-0.5 ml-4"><strong>Лечение:</strong> {p.treatment}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Notes */}
              {examData.notes && (
                <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <h4 className="text-xs font-semibold text-amber-700 uppercase mb-1">Заметки</h4>
                  <p className="text-sm text-gray-700">{examData.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button onClick={() => goToStep('pathologies')} className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" /> Назад
              </button>
              <button onClick={saveExam} className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm">
                <Save className="h-4 w-4" /> Сохранить осмотр
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
