import { useState } from "react";

export default function AcademicClockLogo(props) {
    const [rotation, setRotation] = useState(0);

    const handleClick = () => {
        setRotation((prev) => prev + 30);
    };

    return (
        <svg {...props} viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="penGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FBBF24"/>
                    <stop offset="100%" stopColor="#D97706"/>
                </linearGradient>
            </defs>

            {/* Encadré décoratif */}
            <rect 
                x="5" y="5" width="140" height="140" rx="20" ry="20" 
                fill="#3B82F6" fillOpacity="0.2" 
                stroke="#1D4ED8" strokeWidth="3" 
            />

            {/* Cercle intérieur */}
            <circle 
                cx="75" cy="75" r="50" 
                fill="#FFFFFF" fillOpacity="0.95" 
                stroke="#E0F2FE" strokeWidth="3"
            />

            {/* Stylo plus grand et interactif */}
            <g transform={`rotate(${rotation}, 75, 75)`} onClick={handleClick} style={{ cursor: "pointer" }}>
                <rect 
                    x="73" y="35" width="4" height="60" rx="1"  // plus large et plus long
                    fill="url(#penGrad)" stroke="#B45309" strokeWidth="1"
                />
                <polygon 
                    points="73,35 77,35 75,30"  // pointe plus visible
                    fill="#EF4444" stroke="#B91C1C" strokeWidth="1"
                />
                <circle 
                    cx="75" cy="75" r="4"  // axe central plus grand
                    fill="#1D4ED8" stroke="#3B82F6" strokeWidth="0.5"
                />
            </g>

            {/* Marques d’horloge */}
            {[0,30,60,90,120,150,180,210,240,270,300,330].map(angle => {
                const rad = (angle * Math.PI) / 180;
                const x1 = 75 + Math.cos(rad) * 45;
                const y1 = 75 + Math.sin(rad) * 45;
                const x2 = 75 + Math.cos(rad) * 50;
                const y2 = 75 + Math.sin(rad) * 50;
                return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1E3A8A" strokeWidth="1" />;
            })}
        </svg>
    );
}
