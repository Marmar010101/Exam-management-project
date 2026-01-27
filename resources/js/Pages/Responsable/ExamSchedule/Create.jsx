import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Calendar,
    Clock,
    Save,
    ChevronLeft,
    AlertCircle,
    Users,
    BookOpen,
    CheckCircle,
    Play,
    RefreshCw,
    CheckSquare,
    Square
} from 'lucide-react';

export default function ExamPlanner() {
  const [examType, setExamType] = useState("");
  const [subType, setSubType] = useState("");
  const [autoSelectedExams, setAutoSelectedExams] = useState([]);
  const [excludedExams, setExcludedExams] = useState([]);
  const [selectedExams, setSelectedExams] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dayStartTime, setDayStartTime] = useState("08:00");
  const [dayEndTime, setDayEndTime] = useState("18:00");
  const [generatedSchedule, setGeneratedSchedule] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Données depuis la base de données
  const [examsDB, setExamsDB] = useState([]);
  const [groupsDB, setGroupsDB] = useState([]);
  const [roomsDB, setRoomsDB] = useState([]);
  const [teachersDB, setTeachersDB] = useState([]);

  // Charger les données depuis la base de données
  const loadDataFromDB = async () => {
    try {
      // Charger les examens
      const examsResponse = await fetch(route('responsable.exam-schedule.get-exams'));
      const examsData = await examsResponse.json();
      setExamsDB(examsData.exams || []);

      // Charger les groupes
      const groupsResponse = await fetch(route('responsable.exam-schedule.get-groups'));
      const groupsData = await groupsResponse.json();
      setGroupsDB(groupsData.groups || []);

      // Charger les salles
      const roomsResponse = await fetch(route('responsable.exam-schedule.get-rooms'));
      const roomsData = await roomsResponse.json();
      setRoomsDB(roomsData.rooms || []);

      // Charger les enseignants
      const teachersResponse = await fetch(route('responsable.exam-schedule.get-teachers'));
      const teachersData = await teachersResponse.json();
      setTeachersDB(teachersData.teachers || []);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    loadDataFromDB();
  }, []);

  // Sélection automatique des examens depuis la base de données
  useEffect(() => {
    if (examType && examsDB.length > 0) {
      let filtered = examsDB.filter(ex => {
        const examTypeMatch = ex.exam_type === examType || ex.type === examType;
        if (!examTypeMatch) return false;
        
        if (examType === "Examen" && subType) {
          return ex.exam_sub_type === subType || ex.subType === subType;
        }
        
        return true;
      });
      
      setAutoSelectedExams(filtered);
      setExcludedExams([]);
    } else {
      setAutoSelectedExams([]);
      setExcludedExams([]);
    }
  }, [examType, subType, examsDB]);

  // Calcul de la sélection finale
  useEffect(() => {
    const finalSelection = autoSelectedExams.filter(ex => !excludedExams.includes(ex.id));
    setSelectedExams(finalSelection);
  }, [autoSelectedExams, excludedExams]);

  // Gestion désélection / réactivation
  const toggleExam = (examId) => {
    if (excludedExams.includes(examId)) {
      setExcludedExams(excludedExams.filter(id => id !== examId));
    } else {
      setExcludedExams([...excludedExams, examId]);
    }
  };

  // Génération automatique de planning avec contraintes
  const generateSchedule = async () => {
    setIsGenerating(true);
    
    try {
      const schedule = [];
      let currentDate = new Date(startDate);
      let examsToday = 0;
      let lastGroupExams = {};
      
      // Trier les examens par durée (plus longs en premier)
      const sortedExams = [...selectedExams].sort((a, b) => {
        const durationA = a.duration || 60;
        const durationB = b.duration || 60;
        return durationB - durationA;
      });
      
      sortedExams.forEach((exam, index) => {
        // Contrainte 1: Maximum 3 examens par jour
        if (examsToday >= 3) {
          currentDate.setDate(currentDate.getDate() + 1);
          examsToday = 0;
        }
        
        // Contrainte 2: Minimum 2 jours entre examens du même groupe
        const examGroups = exam.groups || [exam.group];
        examGroups.forEach(group => {
          const groupId = typeof group === 'object' ? group.id : group;
          if (lastGroupExams[groupId]) {
            const daysSinceLastGroup = Math.floor((currentDate - lastGroupExams[groupId]) / (1000 * 60 * 60 * 24));
            if (daysSinceLastGroup < 2) {
              currentDate.setDate(currentDate.getDate() + (2 - daysSinceLastGroup));
              examsToday = 0;
            }
          }
        });
        
        // Contrainte 3: Pas deux modules principaux le même jour
        const isMainModule = exam.main_module || exam.mainModule || false;
        if (isMainModule) {
          const mainModuleExamsToday = schedule.filter(s => 
            new Date(s.date).toDateString() === currentDate.toDateString() && 
            (s.main_module || s.mainModule)
          ).length;
          
          if (mainModuleExamsToday >= 1) {
            currentDate.setDate(currentDate.getDate() + 1);
            examsToday = 0;
          }
        }
        
        // Calcul des heures avec pause de 30 minutes
        const startHour = parseInt(dayStartTime.split(':')[0]);
        const startMinute = parseInt(dayStartTime.split(':')[1]);
        const examStartTime = new Date(currentDate);
        examStartTime.setHours(startHour + (examsToday * 2), startMinute + (examsToday * 30));
        
        const examDuration = exam.duration || 60;
        const examEndTime = new Date(examStartTime);
        examEndTime.setMinutes(examEndTime.getMinutes() + examDuration);
        
        // Assignation automatique
        const roomIndex = index % roomsDB.length;
        const teacherIndex = index % teachersDB.length;
        const room = roomsDB[roomIndex];
        const teacher = teachersDB[teacherIndex];
        
        schedule.push({
          id: exam.id,
          name: exam.module_name || exam.name || `Exam ${exam.id}`,
          type: exam.exam_type || exam.type,
          subType: exam.exam_sub_type || exam.subType,
          mainModule: isMainModule,
          group: examGroups.map(g => typeof g === 'object' ? g.name : g).join(', '),
          duration: examDuration,
          date: currentDate.toISOString().split("T")[0],
          startTime: examStartTime.toTimeString().slice(0, 5),
          endTime: examEndTime.toTimeString().slice(0, 5),
          room: typeof room === 'object' ? room.name : room,
          teacher: typeof teacher === 'object' ? teacher.name : teacher,
          groups: examGroups,
          teachers: [teacher],
          rooms: [room]
        });
        
        examGroups.forEach(group => {
          const groupId = typeof group === 'object' ? group.id : group;
          lastGroupExams[groupId] = new Date(currentDate);
        });
        examsToday += 1;
      });

      setGeneratedSchedule(schedule);
      
      // Sauvegarder dans la base de données
      await saveScheduleToDB(schedule);
      
    } catch (error) {
      console.error('Erreur lors de la génération du planning:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Sauvegarder le planning dans la base de données
  const saveScheduleToDB = async (schedule) => {
    try {
      const response = await fetch(route('responsable.exam-schedule.save'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({
          schedule: schedule,
          examType: examType,
          subType: subType,
          startDate: startDate,
          endDate: endDate,
          excludedExamIds: excludedExams
        })
      });
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Erreur lors de la sauvegarde');
      }
      
      return result;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw error;
    }
  };

  const resetForm = () => {
    setExamType("");
    setSubType("");
    setAutoSelectedExams([]);
    setExcludedExams([]);
    setSelectedExams([]);
    setStartDate("");
    setEndDate("");
    setDayStartTime("08:00");
    setDayEndTime("18:00");
    setGeneratedSchedule([]);
  };

  const saveSchedule = async () => {
    try {
      await saveScheduleToDB(generatedSchedule);
      alert("Planning sauvegardé avec succès !");
    } catch (error) {
      alert("Erreur lors de la sauvegarde: " + error.message);
    }
  };

  return (
    <AuthenticatedLayout header="Automatic Exam Schedule Generator">
      <Head title="Automatic Exam Schedule Generator" />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              href={route('responsable.exam-plans.index')}
              className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Exam Plans
            </Link>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Automatic Exam Schedule Generator</h1>
            <p className="text-gray-600 mt-1">Generate exam schedules automatically with minimal human intervention</p>
          </div>
        </div>

        {!generatedSchedule.length > 0 ? (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-6">Créer un planning d'examens</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Type d'examen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'examen <span className="text-red-500">*</span>
                </label>
                <select 
                  value={examType} 
                  onChange={e => setExamType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Choisir --</option>
                  <option value="Contrôle">Contrôle</option>
                  <option value="Test TP">Test TP</option>
                  <option value="Examen">Examen</option>
                </select>
              </div>

              {/* Sous-type (conditionnel) */}
              {examType === "Examen" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sous-type <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={subType} 
                    onChange={e => setSubType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">-- Choisir --</option>
                    <option value="Normal">Normal</option>
                    <option value="Rattrapage">Rattrapage</option>
                    <option value="Remplacement">Remplacement</option>
                  </select>
                </div>
              )}

              {/* Date début */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date début <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={e => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Date fin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date fin <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={e => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Heure début journée */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure de début journée
                </label>
                <input 
                  type="time" 
                  value={dayStartTime} 
                  onChange={e => setDayStartTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Heure fin journée */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure de fin journée
                </label>
                <input 
                  type="time" 
                  value={dayEndTime} 
                  onChange={e => setDayEndTime(e.target.value)}
                  min={dayStartTime}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Section de sélection automatique */}
            {autoSelectedExams.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Examens sélectionnés automatiquement ({selectedExams.length}/{autoSelectedExams.length})
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Cliquez sur les examens pour les exclure du planning
                </p>
                
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                  {autoSelectedExams.map(ex => (
                    <div
                      key={ex.id}
                      className={`flex items-center p-3 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors ${
                        excludedExams.includes(ex.id) 
                          ? 'bg-red-50 hover:bg-red-100' 
                          : 'bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => toggleExam(ex.id)}
                    >
                      <div className="mr-3">
                        {excludedExams.includes(ex.id) ? (
                          <Square className="h-5 w-5 text-gray-400" />
                        ) : (
                          <CheckSquare className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {ex.module_name || ex.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {(ex.groups || []).map(g => typeof g === 'object' ? g.name : g).join(', ')} • {ex.duration || 60} min • {(ex.main_module || ex.mainModule) ? 'Module principal' : 'Module secondaire'}
                            </div>
                          </div>
                          {excludedExams.includes(ex.id) && (
                            <span className="text-xs text-red-600 font-medium bg-red-100 px-2 py-1 rounded">
                              Exclu
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedExams.length === 0 && (
                  <p className="mt-2 text-sm text-amber-600">
                    ⚠️ Aucun examen sélectionné pour la planification
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
              >
                <RefreshCw className="h-4 w-4 mr-2 inline" />
                Reset
              </button>
              <button
                onClick={generateSchedule}
                disabled={!examType || !startDate || !endDate || selectedExams.length === 0 || isGenerating}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 flex items-center"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Génération...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Générer le planning
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Affichage du planning généré */
          <div className="space-y-6">
            {/* Success Message */}
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-green-800 mb-1">Planning généré avec succès!</h3>
                  <p className="text-sm text-green-700">Toutes les contraintes ont été respectées automatiquement</p>
                </div>
              </div>
            </div>

            {/* Résumé */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Résumé du planning</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{generatedSchedule.length}</div>
                    <div className="text-sm text-gray-600">Total examens</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {new Set(Array.isArray(generatedSchedule) ? generatedSchedule.map(s => s.date) : []).size}
                    </div>
                    <div className="text-sm text-gray-600">Jours utilisés</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {new Set(Array.isArray(generatedSchedule) ? generatedSchedule.flatMap(s => s.groups || [s.group]) : []).size}
                    </div>
                    <div className="text-sm text-gray-600">Groupes</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {new Set(Array.isArray(generatedSchedule) ? generatedSchedule.map(s => s.room) : []).size}
                    </div>
                    <div className="text-sm text-gray-600">Salles</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Détails du planning */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Détails du planning généré</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Examen
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Heure
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Groupe
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Salle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enseignant
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Array.isArray(generatedSchedule) ? generatedSchedule.map((exam, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {exam.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(exam.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {exam.startTime} - {exam.endTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {exam.group}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {exam.room}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {exam.teacher}
                        </td>
                      </tr>
                    )) : []}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions finales */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Générer un nouveau
              </button>
              <button
                onClick={saveSchedule}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder le planning
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
