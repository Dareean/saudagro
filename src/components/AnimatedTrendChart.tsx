import React, { useState } from 'react';

export interface DataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  dateStr?: string;
}

interface AnimatedTrendChartProps {
  title: string;
  subtitle?: string;
  unit?: string;
  secondaryUnit?: string;
  primaryColor?: string;
  secondaryColor?: string;
  primaryLegend?: string;
  secondaryLegend?: string;
  data: DataPoint[];
  periods?: string[];
  height?: number;
  formatValue?: (val: number) => string;
  formatSecondaryValue?: (val: number) => string;
}

export const AnimatedTrendChart: React.FC<AnimatedTrendChartProps> = ({
  title,
  subtitle,
  unit = 'Rp',
  secondaryUnit,
  primaryColor = '#047857',
  secondaryColor = '#3B82F6',
  primaryLegend = 'Harga Realisasi',
  secondaryLegend,
  data,
  periods = ['30 Hari', '3 Bulan', '6 Bulan'],
  height = 220,
  formatValue = (v) => v.toLocaleString('id-ID'),
  formatSecondaryValue = (v) => v.toLocaleString('id-ID'),
}) => {
  const [activePeriod, setActivePeriod] = useState(periods[0] || '30 Hari');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const svgWidth = 700;
  const svgHeight = height;
  const paddingX = 45;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const primaryValues = data.map(d => d.value);
  const minVal = Math.min(...primaryValues) * 0.96;
  const maxVal = Math.max(...primaryValues) * 1.04;
  const valRange = maxVal - minVal || 1;

  // Secondary values if exists
  const hasSecondary = data.some(d => d.secondaryValue !== undefined);
  const secondaryValues = hasSecondary ? data.map(d => d.secondaryValue || 0) : [];
  const minSec = hasSecondary ? Math.min(...secondaryValues) * 0.9 : 0;
  const maxSec = hasSecondary ? Math.max(...secondaryValues) * 1.1 : 1;
  const secRange = maxSec - minSec || 1;

  // Coordinate mapper
  const getX = (index: number) => paddingX + (index / (data.length - 1)) * chartWidth;
  const getY = (val: number) => paddingTop + chartHeight - ((val - minVal) / valRange) * chartHeight;
  const getSecY = (val: number) => paddingTop + chartHeight - ((val - minSec) / secRange) * chartHeight;

  // Generate smooth cubic bezier SVG path
  const generateSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const primaryPoints = data.map((d, i) => ({ x: getX(i), y: getY(d.value) }));
  const primaryLinePath = generateSmoothPath(primaryPoints);
  const primaryAreaPath = `${primaryLinePath} L ${primaryPoints[primaryPoints.length - 1].x} ${paddingTop + chartHeight} L ${primaryPoints[0].x} ${paddingTop + chartHeight} Z`;

  const secondaryPoints = hasSecondary ? data.map((d, i) => ({ x: getX(i), y: getSecY(d.secondaryValue || 0) })) : [];
  const secondaryLinePath = hasSecondary ? generateSmoothPath(secondaryPoints) : '';

  // Grid lines (4 horizontal ticks)
  const gridTicks = [0, 0.33, 0.66, 1].map(ratio => {
    const val = minVal + ratio * valRange;
    const y = paddingTop + chartHeight - ratio * chartHeight;
    return { val, y };
  });

  const hoveredData = hoveredIndex !== null ? data[hoveredIndex] : null;
  const hoveredPoint = hoveredIndex !== null ? primaryPoints[hoveredIndex] : null;

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid var(--border-subtle)',
      borderRadius: '12px',
      padding: '20px 22px',
      overflow: 'hidden'
    }}>
      {/* Header with Title, Period Filter & Legend */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0, letterSpacing: '-0.01em' }}>
            {title}
          </h3>
          {subtitle && (
            <p style={{ fontSize: '0.76rem', color: 'var(--slate-500)', margin: '3px 0 0 0' }}>
              {subtitle}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.74rem', color: 'var(--slate-600)', fontWeight: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: primaryColor }} />
              <span>{primaryLegend}</span>
            </div>
            {hasSecondary && secondaryLegend && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: secondaryColor }} />
                <span>{secondaryLegend}</span>
              </div>
            )}
          </div>

          {/* Period selector */}
          {periods.length > 1 && (
            <div style={{ display: 'flex', background: 'var(--slate-100)', padding: '2px', borderRadius: '7px' }}>
              {periods.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setActivePeriod(p)}
                  style={{
                    border: 'none',
                    background: activePeriod === p ? '#FFFFFF' : 'transparent',
                    color: activePeriod === p ? 'var(--slate-900)' : 'var(--slate-500)',
                    fontWeight: activePeriod === p ? 700 : 500,
                    fontSize: '0.72rem',
                    padding: '3px 9px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    boxShadow: activePeriod === p ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SVG Interactive Chart Canvas */}
      <div style={{ position: 'relative', width: '100%', height: `${height}px` }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id={`areaGrad-${title.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.18" />
              <stop offset="100%" stopColor={primaryColor} stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id={`secGrad-${title.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={secondaryColor} stopOpacity="0.12" />
              <stop offset="100%" stopColor={secondaryColor} stopOpacity="0.0" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Horizontal Gridlines & Left Labels */}
          {gridTicks.map((t, idx) => (
            <g key={idx}>
              <line
                x1={paddingX}
                y1={t.y}
                x2={svgWidth - paddingX}
                y2={t.y}
                stroke="#F1F5F9"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={paddingX - 8}
                y={t.y + 3}
                fill="#94A3B8"
                fontSize="10"
                textAnchor="end"
                fontWeight="500"
              >
                {unit === 'Rp' ? `Rp ${(Math.round(t.val) / 1000).toFixed(1)}k` : `${Math.round(t.val)}`}
              </text>
            </g>
          ))}

          {/* Secondary Line if present */}
          {hasSecondary && (
            <path
              d={secondaryLinePath}
              fill="none"
              stroke={secondaryColor}
              strokeWidth="2"
              strokeDasharray="3 3"
              opacity="0.8"
            />
          )}

          {/* Primary Gradient Area with Fade-in Animation */}
          <path
            d={primaryAreaPath}
            fill={`url(#areaGrad-${title.replace(/\s+/g, '')})`}
            style={{
              animation: 'chartAreaFadeIn 0.8s ease-out forwards',
              opacity: 0
            }}
          />

          {/* Primary Smooth Curve Line with Draw-in Animation */}
          <path
            d={primaryLinePath}
            fill="none"
            stroke={primaryColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 2000,
              strokeDashoffset: 2000,
              animation: 'chartLineDraw 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          />

          {/* X Axis Date Labels */}
          {data.map((d, i) => {
            const x = getX(i);
            const isEverySecond = data.length > 8 ? i % 2 === 0 : true;
            if (!isEverySecond && i !== data.length - 1) return null;
            return (
              <text
                key={i}
                x={x}
                y={paddingTop + chartHeight + 18}
                fill="#94A3B8"
                fontSize="10"
                textAnchor="middle"
                fontWeight="500"
              >
                {d.label}
              </text>
            );
          })}

          {/* Hover Crosshair Vertical Line */}
          {hoveredPoint && (
            <g>
              <line
                x1={hoveredPoint.x}
                y1={paddingTop}
                x2={hoveredPoint.x}
                y2={paddingTop + chartHeight}
                stroke="#64748B"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r="5"
                fill="#FFFFFF"
                stroke={primaryColor}
                strokeWidth="2.5"
                filter="url(#shadow)"
              />
              {hasSecondary && hoveredIndex !== null && (
                <circle
                  cx={hoveredPoint.x}
                  cy={secondaryPoints[hoveredIndex].y}
                  r="4"
                  fill="#FFFFFF"
                  stroke={secondaryColor}
                  strokeWidth="2"
                />
              )}
            </g>
          )}

          {/* Invisible hover hotspot zones for each data column */}
          {data.map((_, i) => {
            const colWidth = chartWidth / (data.length - 1);
            const x = getX(i) - colWidth / 2;
            return (
              <rect
                key={i}
                x={x}
                y={paddingTop}
                width={colWidth}
                height={chartHeight}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredIndex(i)}
              />
            );
          })}
        </svg>

        {/* Floating Tooltip Box on Hover */}
        {hoveredData && hoveredPoint && (
          <div
            style={{
              position: 'absolute',
              left: `${(hoveredPoint.x / svgWidth) * 100}%`,
              top: `${Math.max(10, (hoveredPoint.y / svgHeight) * 100 - 35)}%`,
              transform: 'translate(-50%, -100%)',
              background: '#0F172A',
              color: '#FFFFFF',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 600,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              transition: 'all 0.1s ease-out'
            }}
          >
            <div style={{ color: '#94A3B8', fontSize: '0.66rem', fontWeight: 500 }}>
              {hoveredData.dateStr || hoveredData.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: primaryColor }} />
              <span>{primaryLegend}: <strong>{unit === 'Rp' ? `Rp ` : ''}{formatValue(hoveredData.value)} {unit !== 'Rp' ? unit : ''}</strong></span>
            </div>
            {hasSecondary && hoveredData.secondaryValue !== undefined && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: secondaryColor }} />
                <span>{secondaryLegend}: <strong>{formatSecondaryValue(hoveredData.secondaryValue)} {secondaryUnit}</strong></span>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes chartLineDraw {
          to {
            strokeDashoffset: 0;
          }
        }
        @keyframes chartAreaFadeIn {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
