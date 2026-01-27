import React from 'react';

const DepartmentPlanningView = ({ planning }) => {
    const getDepartmentColorClass = (color) => {
        const colorClasses = {
            blue: 'bg-blue-100 border-blue-300 text-blue-800',
            purple: 'bg-purple-100 border-purple-300 text-purple-800',
            green: 'bg-green-100 border-green-300 text-green-800',
            red: 'bg-red-100 border-red-300 text-red-800',
            orange: 'bg-orange-100 border-orange-300 text-orange-800',
            indigo: 'bg-indigo-100 border-indigo-300 text-indigo-800',
            gray: 'bg-gray-100 border-gray-300 text-gray-800'
        };
        return colorClasses[color] || colorClasses.blue;
    };

    const getCellContent = (cell) => {
        if (!cell) {
            return <div className="text-center text-gray-400 text-xs">-</div>;
        }

        return (
            <div className="p-2 text-xs space-y-1">
                <div className="font-semibold text-gray-800">
                    Modules: {cell.modules.join(', ')}
                </div>
                <div className="text-gray-600">
                    Enseignant: {cell.teacher}
                </div>
                <div className="text-gray-600">
                    Salle: {cell.room}
                </div>
                <div className={`text-xs font-medium ${
                    cell.groupSize > cell.roomCapacity ? 'text-red-600' : 'text-green-600'
                }`}>
                    {cell.groupSize}/{cell.roomCapacity}
                </div>
            </div>
        );
    };

    const renderDepartment = (deptKey, department) => {
        return (
            <div key={deptKey} className="mb-8">
                {/* Department Header */}
                <div className={`border-2 rounded-lg p-4 mb-4 ${getDepartmentColorClass(department.color)}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">{department.icon}</span>
                            <div>
                                <h3 className="text-xl font-bold">{department.name}</h3>
                                <p className="text-sm opacity-75">
                                    Session Janvier 2026 • {department.totalExams} examens
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Department Levels */}
                {Object.entries(department.levels).map(([levelKey, level]) => (
                    <div key={levelKey} className="ml-6 mb-6">
                        <h4 className="text-lg font-semibold text-gray-700 mb-3">
                            {level.name}
                        </h4>
                        
                        {/* Level Specialties */}
                        {Object.entries(level.specialties).map(([specialtyKey, specialty]) => (
                            <div key={specialtyKey} className="ml-6 mb-4">
                                <h5 className="text-md font-medium text-gray-600 mb-2">
                                    {specialty.name}
                                </h5>
                                
                                {/* Specialty Groups */}
                                {specialty.groups.map((group) => (
                                    <div key={group.id} className="ml-6 mb-4">
                                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                            {/* Group Header */}
                                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                                                <h6 className="text-sm font-medium text-gray-700">
                                                    {group.name} ({group.students} étudiants)
                                                </h6>
                                            </div>
                                            
                                            {/* Exams Grid */}
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                                                Créneau
                                                            </th>
                                                            {planning.dates.map((date, index) => (
                                                                <th key={index} className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-40">
                                                                    {date}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {planning.timeSlots.map((timeSlot, slotIndex) => (
                                                            <tr key={slotIndex}>
                                                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                    {timeSlot}
                                                                </td>
                                                                {planning.dates.map((date, dateIndex) => (
                                                                    <td key={dateIndex} className="px-2 py-2 border border-gray-200 min-w-40 max-h-24 overflow-y-auto">
                                                                        {getCellContent(group.examsGrid[slotIndex][dateIndex])}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Global Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {planning.title}
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                    {planning.subtitle}
                </p>
                
                {/* Global Stats */}
                <div className="flex justify-center space-x-8 mb-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{planning.totalDepartments}</div>
                        <div className="text-sm text-gray-600">Départements</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{planning.conflictIndicators.totalExams}</div>
                        <div className="text-sm text-gray-600">Total Examens</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{planning.availableRooms.length}</div>
                        <div className="text-sm text-gray-600">Salles Disponibles</div>
                    </div>
                </div>
                
                {/* Available Rooms */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Salles Disponibles:</h3>
                    <div className="flex flex-wrap justify-center gap-2">
                        {planning.availableRooms.map((room, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-white border border-gray-300">
                                {room.name} ({room.capacity})
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Departments */}
            <div className="space-y-6">
                {Object.entries(planning.departments).map(([deptKey, department]) => 
                    renderDepartment(deptKey, department)
                )}
            </div>

            {/* Conflict Indicators */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8">
                <h3 className="text-sm font-semibold text-yellow-800 mb-2">Indicateurs de Gestion des Conflits:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <span className="font-medium">Total Examens:</span> {planning.conflictIndicators.totalExams}
                    </div>
                    <div>
                        <span className="font-medium">Conflits Enseignants:</span> {planning.conflictIndicators.teacherConflicts}
                    </div>
                    <div>
                        <span className="font-medium">Conflits Salles:</span> {planning.conflictIndicators.roomConflicts}
                    </div>
                    <div className={planning.conflictIndicators.capacityIssues > 0 ? 'text-red-600' : 'text-green-600'}>
                        <span className="font-medium">Problèmes Capacité:</span> {planning.conflictIndicators.capacityIssues}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentPlanningView;
