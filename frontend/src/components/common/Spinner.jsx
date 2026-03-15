function Spinner({ size = 200 }) {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            minHeight: "300px"
        }}>
            <svg width={size} height={size} viewBox="100 60 260 160" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <marker id="arrowS" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </marker>
                    <style>{`
                        @keyframes aparecer {
                            0% { opacity: 0; transform: scale(0.2); }
                            40% { opacity: 1; transform: scale(1); }
                            80% { opacity: 0.7; }
                            100% { opacity: 0; transform: scale(0.2); }
                        }
                        @keyframes trazarLinea {
                            0% { stroke-dashoffset: 80; opacity: 0; }
                            40% { stroke-dashoffset: 0; opacity: 0.7; }
                            80% { opacity: 0.5; }
                            100% { stroke-dashoffset: 80; opacity: 0; }
                        }
                        @keyframes pulseCentro {
                            0%, 100% { transform: scale(1); opacity: 0.9; }
                            50% { transform: scale(1.25); opacity: 0.5; }
                        }
                        .sn1 { transform-box: fill-box; transform-origin: center; animation: aparecer 3.6s ease-in-out infinite 0s; }
                        .sn2 { transform-box: fill-box; transform-origin: center; animation: aparecer 3.6s ease-in-out infinite 0.3s; }
                        .sn3 { transform-box: fill-box; transform-origin: center; animation: aparecer 3.6s ease-in-out infinite 0.6s; }
                        .sn4 { transform-box: fill-box; transform-origin: center; animation: aparecer 3.6s ease-in-out infinite 0.9s; }
                        .sn6 { transform-box: fill-box; transform-origin: center; animation: aparecer 3.6s ease-in-out infinite 1.2s; }
                        .sn7 { transform-box: fill-box; transform-origin: center; animation: aparecer 3.6s ease-in-out infinite 1.5s; }
                        .sn8 { transform-box: fill-box; transform-origin: center; animation: aparecer 3.6s ease-in-out infinite 1.8s; }
                        .sc  { transform-box: fill-box; transform-origin: center; animation: pulseCentro 1.2s ease-in-out infinite; }
                        .sl1 { stroke-dasharray: 80; animation: trazarLinea 3.6s ease-in-out infinite 0.15s; }
                        .sl2 { stroke-dasharray: 80; animation: trazarLinea 3.6s ease-in-out infinite 0.45s; }
                        .sl3 { stroke-dasharray: 80; animation: trazarLinea 3.6s ease-in-out infinite 0.75s; }
                        .sl4 { stroke-dasharray: 80; animation: trazarLinea 3.6s ease-in-out infinite 1.05s; }
                        .sl5 { stroke-dasharray: 80; animation: trazarLinea 3.6s ease-in-out infinite 1.35s; }
                        .sl6 { stroke-dasharray: 80; animation: trazarLinea 3.6s ease-in-out infinite 1.65s; }
                        .sl7 { stroke-dasharray: 80; animation: trazarLinea 3.6s ease-in-out infinite 1.95s; }
                    `}</style>
                </defs>

                <circle className="sn1" cx="140" cy="180" r="6" fill="#7dd3fc" opacity="0.6"/>
                <circle className="sn2" cx="170" cy="120" r="8" fill="#7dd3fc" opacity="0.75"/>
                <circle className="sn3" cx="215" cy="80" r="6" fill="#7dd3fc" opacity="0.6"/>
                <circle className="sn4" cx="200" cy="160" r="7" fill="#38bdf8"/>
                <circle className="sc"  cx="255" cy="130" r="10" fill="#0ea5e9"/>
                <circle className="sn6" cx="310" cy="100" r="7" fill="#7dd3fc" opacity="0.8"/>
                <circle className="sn7" cx="300" cy="170" r="6" fill="#38bdf8" opacity="0.7"/>
                <circle className="sn8" cx="255" cy="195" r="5" fill="#7dd3fc" opacity="0.5"/>

                <line className="sl1" x1="146" y1="175" x2="164" y2="127" stroke="#7dd3fc" strokeWidth="1.2" fill="none" markerEnd="url(#arrowS)" opacity="0.6"/>
                <line className="sl2" x1="176" y1="115" x2="211" y2="85" stroke="#38bdf8" strokeWidth="1.2" fill="none" markerEnd="url(#arrowS)" opacity="0.65"/>
                <line className="sl3" x1="207" y1="154" x2="246" y2="136" stroke="#0ea5e9" strokeWidth="1.4" fill="none" markerEnd="url(#arrowS)" opacity="0.8"/>
                <line className="sl4" x1="264" y1="125" x2="304" y2="104" stroke="#38bdf8" strokeWidth="1.2" fill="none" markerEnd="url(#arrowS)" opacity="0.7"/>
                <line className="sl5" x1="262" y1="135" x2="298" y2="165" stroke="#7dd3fc" strokeWidth="1" fill="none" markerEnd="url(#arrowS)" opacity="0.5"/>
                <line className="sl6" x1="175" y1="125" x2="197" y2="157" stroke="#7dd3fc" strokeWidth="0.8" fill="none" markerEnd="url(#arrowS)" opacity="0.4"/>
                <line className="sl7" x1="258" y1="190" x2="296" y2="173" stroke="#7dd3fc" strokeWidth="0.8" fill="none" markerEnd="url(#arrowS)" opacity="0.4"/>
            </svg>
        </div>
    )
}

export default Spinner