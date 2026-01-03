import React, { useState, useEffect } from 'react';

const AcademicSelector = ({
    selectedSystem,
    selectedLevel,
    selectedSpeciality,
    selectedSemester,
    onSystemChange,
    onLevelChange,
    onSpecialityChange,
    onSemesterChange
}) => {
    const [systems, setSystems] = useState([]);
    const [levels, setLevels] = useState([]);
    const [specialities, setSpecialities] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadSystems = async () => {
            try {
                const response = await fetch('/api/academic/structure');
                if (!response.ok) throw new Error('Network error');
                const data = await response.json();
                setSystems(data || []);
            } catch (err) {
                console.error('Error loading systems:', err);
                setSystems([]);
            }
        };
        loadSystems();
    }, []);

    useEffect(() => {
        if (selectedSystem) {
            setLoading(true);
            const loadLevels = async () => {
                try {
                    const response = await fetch(`/api/academic/systems/${selectedSystem}/levels`);
                    if (!response.ok) throw new Error('Network error');
                    const data = await response.json();
                    setLevels(data || []);
                    setSpecialities([]);
                    setSemesters([]);
                    onLevelChange('');
                    onSpecialityChange('');
                    onSemesterChange('');
                } catch (err) {
                    console.error('Error loading levels:', err);
                    setLevels([]);
                } finally {
                    setLoading(false);
                }
            };
            loadLevels();
        }
    }, [selectedSystem]);

    useEffect(() => {
        if (selectedLevel) {
            setLoading(true);
            const loadAcademicData = async () => {
                try {
                    // Charger les spécialités
                    const specialitiesResponse = await fetch(`/api/academic/levels/${selectedLevel}/specialities`);
                    if (specialitiesResponse.ok) {
                        const specialitiesData = await specialitiesResponse.json();
                        setSpecialities(specialitiesData || []);
                    }

                    // Charger les semestres
                    const semestersResponse = await fetch(`/api/academic/levels/${selectedLevel}/semesters`);
                    if (semestersResponse.ok) {
                        const semestersData = await semestersResponse.json();
                        setSemesters(semestersData || []);
                    }
                } catch (err) {
                    console.error('Error loading academic data:', err);
                    setSpecialities([]);
                    setSemesters([]);
                } finally {
                    setLoading(false);
                }
            };
            loadAcademicData();
        }
    }, [selectedLevel]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Système d'études
                </label>
                <select 
                    value={selectedSystem} 
                    onChange={(e) => onSystemChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Choisir le système...</option>
                    {systems && systems.map(system => (
                        <option key={system.id} value={system.id}>
                            {system.name} ({system.diploma_type})
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Niveau
                </label>
                <select 
                    value={selectedLevel} 
                    onChange={(e) => onLevelChange(e.target.value)}
                    disabled={!selectedSystem || loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                    <option value="">Choisir le niveau...</option>
                    {levels && levels.map(level => (
                        <option key={level.id} value={level.id}>
                            {level.name} - {level.full_name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spécialité
                </label>
                <select 
                    value={selectedSpeciality} 
                    onChange={(e) => onSpecialityChange(e.target.value)}
                    disabled={!selectedLevel || loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                    <option value="">Choisir la spécialité...</option>
                    {specialities && specialities.map(speciality => (
                        <option key={speciality.id} value={speciality.id}>
                            {speciality.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semestre
                </label>
                <select 
                    value={selectedSemester} 
                    onChange={(e) => onSemesterChange(e.target.value)}
                    disabled={!selectedLevel || loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                    <option value="">Choisir le semestre...</option>
                    {semesters && semesters.map(semester => (
                        <option key={semester.id} value={semester.id}>
                            {semester.name}
                        </option>
                    ))}
                </select>
            </div>

            {loading && (
                <div className="col-span-full text-center text-sm text-gray-500">
                    Chargement...
                </div>
            )}
        </div>
    );
};

export default AcademicSelector;
