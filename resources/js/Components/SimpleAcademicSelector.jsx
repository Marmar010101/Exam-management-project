import React, { useState, useEffect } from 'react';

const SimpleAcademicSelector = ({ 
    selectedSystem, 
    selectedLevel, 
    selectedSpeciality, 
    onSystemChange, 
    onLevelChange, 
    onSpecialityChange 
}) => {
    const [systems, setSystems] = useState([]);
    const [levels, setLevels] = useState([]);
    const [specialities, setSpecialities] = useState([]);
    const [loading, setLoading] = useState(false);

    // Charger les niveaux et spécialités au montage pour affichage immédiat
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Charger tous les systèmes
                const systemsResponse = await fetch('/api/academic/structure');
                const systemsData = await systemsResponse.json();
                setSystems(systemsData || []);
                
                // Charger tous les niveaux disponibles
                const levelsResponse = await fetch('/api/academic/levels/all');
                if (levelsResponse.ok) {
                    const levelsData = await levelsResponse.json();
                    setLevels(levelsData || []);
                }
                
                // Charger toutes les spécialités disponibles
                const specialitiesResponse = await fetch('/api/academic/specialities/all');
                if (specialitiesResponse.ok) {
                    const specialitiesData = await specialitiesResponse.json();
                    setSpecialities(specialitiesData || []);
                }
            } catch (err) {
                console.error('Error loading initial data:', err);
                setSystems([]);
                setLevels([]);
                setSpecialities([]);
            }
        };
        loadInitialData();
    }, []);

    // Charger les niveaux quand le système change
    useEffect(() => {
        if (selectedSystem) {
            const loadLevels = async () => {
                try {
                    setLoading(true);
                    const response = await fetch(`/api/academic/system/${selectedSystem}/levels`);
                    const data = await response.json();
                    setLevels(data || []);
                    setSpecialities([]); // Réinitialiser les spécialités
                } catch (err) {
                    console.error('Error loading levels:', err);
                    setLevels([]);
                } finally {
                    setLoading(false);
                }
            };
            loadLevels();
        } else {
            setLevels([]);
            setSpecialities([]);
        }
    }, [selectedSystem]);

    // Charger les spécialités quand le niveau change
    useEffect(() => {
        if (selectedLevel) {
            const loadSpecialities = async () => {
                try {
                    setLoading(true);
                    const response = await fetch(`/api/academic/level/${selectedLevel}/specialities`);
                    const data = await response.json();
                    setSpecialities(data || []);
                } catch (err) {
                    console.error('Error loading specialities:', err);
                    setSpecialities([]);
                } finally {
                    setLoading(false);
                }
            };
            loadSpecialities();
        } else {
            setSpecialities([]);
        }
    }, [selectedLevel]);

    return (
        <div className="space-y-4">
            {/* Système */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Système de Formation
                </label>
                <select
                    value={selectedSystem}
                    onChange={(e) => {
                        onSystemChange(e.target.value);
                        onLevelChange(''); // Réinitialiser le niveau
                        onSpecialityChange(''); // Réinitialiser la spécialité
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Sélectionner un système</option>
                    {systems.map((system) => (
                        <option key={system.id} value={system.id}>
                            {system.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Niveau */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Niveau
                </label>
                <select
                    value={selectedLevel}
                    onChange={(e) => {
                        onLevelChange(e.target.value);
                        onSpecialityChange(''); // Réinitialiser la spécialité
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!selectedSystem || loading}
                >
                    <option value="">Sélectionner un niveau</option>
                    {levels.map((level) => (
                        <option key={level.id} value={level.id}>
                            {level.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Spécialité */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Spécialité
                </label>
                <select
                    value={selectedSpeciality}
                    onChange={(e) => onSpecialityChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!selectedLevel || loading}
                >
                    <option value="">Sélectionner une spécialité</option>
                    {specialities.map((speciality) => (
                        <option key={speciality.id} value={speciality.id}>
                            {speciality.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Indicateur de chargement */}
            {loading && (
                <div className="text-sm text-gray-500">
                    Chargement...
                </div>
            )}
        </div>
    );
};

export default SimpleAcademicSelector;
