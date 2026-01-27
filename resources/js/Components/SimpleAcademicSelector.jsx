import React, { useState, useEffect } from 'react';

const SimpleAcademicSelector = ({ 
    selectedSystem, 
    selectedLevel, 
    selectedSpeciality, 
    onSystemChange, 
    onLevelChange, 
    onSpecialityChange,
    showFrenchLabels = false,
    cycles = [],
    levels = [],
    specialities = [],
    semesters = []
}) => {
    const [filteredLevels, setFilteredLevels] = useState([]);
    const [filteredSpecialities, setFilteredSpecialities] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filter levels when system changes
    useEffect(() => {
        if (selectedSystem) {
            const systemLevels = levels.filter(level => level.cycle_id == selectedSystem);
            setFilteredLevels(systemLevels);
            setFilteredSpecialities([]); // Reset specialities
        } else {
            setFilteredLevels(levels);
            setFilteredSpecialities(specialities);
        }
    }, [selectedSystem, levels]);

    // Filter specialities when level changes
    useEffect(() => {
        if (selectedLevel) {
            // For now, show all specialities for any level
            setFilteredSpecialities(specialities);
        } else {
            setFilteredSpecialities([]);
        }
    }, [selectedLevel, specialities]);

    return (
        <div className="space-y-4">
            {/* System */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {showFrenchLabels ? 'Système de Formation' : 'Training System'}
                </label>
                <select
                    value={selectedSystem}
                    onChange={(e) => {
                        onSystemChange(e.target.value);
                        onLevelChange(''); // Reset level
                        onSpecialityChange(''); // Reset speciality
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">{showFrenchLabels ? 'Sélectionner un système' : 'Select a system'}</option>
                    {cycles.map((system) => (
                        <option key={system.id} value={system.id}>
                            {system.cycle_name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Level */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {showFrenchLabels ? 'Niveau' : 'Level'}
                </label>
                <select
                    value={selectedLevel}
                    onChange={(e) => {
                        onLevelChange(e.target.value);
                        onSpecialityChange(''); // Reset speciality
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!selectedSystem || loading}
                >
                    <option value="">{showFrenchLabels ? 'Sélectionner un niveau' : 'Select a level'}</option>
                    {filteredLevels.map((level) => (
                        <option key={level.id} value={level.id}>
                            {level.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Speciality */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {showFrenchLabels ? 'Spécialité' : 'Speciality'}
                </label>
                <select
                    value={selectedSpeciality}
                    onChange={(e) => onSpecialityChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!selectedLevel || loading}
                >
                    <option value="">{showFrenchLabels ? 'Sélectionner une spécialité' : 'Select a speciality'}</option>
                    {filteredSpecialities.map((speciality) => (
                        <option key={speciality.id} value={speciality.id}>
                            {speciality.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Loading indicator */}
            {loading && (
                <div className="text-sm text-gray-500">
                    {showFrenchLabels ? 'Chargement...' : 'Loading...'}
                </div>
            )}
        </div>
    );
};

export default SimpleAcademicSelector;
