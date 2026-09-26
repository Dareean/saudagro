import React, { useState, useMemo } from 'react';

export interface DataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  dateStr?: string;
}

export interface AnimatedTrendChartProps {
  title: string;
  subtitle?: string;
  unit?: string;
  secondaryUnit?: string;
  primaryColor?: string;
  secondaryColor?: string;
  primaryLegend?: string;
  secondaryLegend?: string;
  data: DataPoint[];
  periodDataMap?: Record<string, DataPoint[]>;
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
  data: initialData,
  periodDataMap,
  periods = ['7 Hari', '30 Hari', '3 Bulan', '6 Bulan'],
  height = 220,
  formatValue = (v) => v.toLocaleString('id-ID'),
  formatSecondaryValue = (v) => v.toLocaleString('id-ID'),
}) => {
  const [activePeriod, setActivePeriod] = useState(periods.includes('30 Hari') ? '30 Hari' : periods[0] || '30 Hari');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Compute dataset for selected period
  const currentData: DataPoint[] = useMemo(() => {
    if (periodDataMap && periodDataMap[activePeriod]) {
      return periodDataMap[activePeriod];
    }
    if (!initialData || initialData.length === 0) return [];

    const baseLen = initialData.length;
    const baseFirst = initialData[0];
    const baseLast = initialData[baseLen - 1];
    const baseAvg = initialData.reduce((acc, d) => acc + d.value, 0) / baseLen;
    const baseSecAvg = initialData.reduce((acc, d) => acc + (d.secondaryValue || 0), 0) / baseLen;

    if (activePeriod === '7 Hari') {
      const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Hari Ini'];
      const varianceFactors = [-0.02, -0.01, 0.01, 0.03, 0.02, 0.04, 0.05];
      return days.map((day, idx) => {
        const factor = 1 + varianceFactors[idx];
        const val = Math.round(baseLast.value * factor);
        const secVal = baseLast.secondaryValue !== undefined 
          ? Math.round(baseLast.secondaryValue * (1 + varianceFactors[idx] * 0.8))
          : undefined;
        return {
          label: day,
          dateStr: `Hari ke-${idx + 1} (${day})`,
          value: Math.max(1, val),
          secondaryValue: secVal
        };
      });
    }

    if (activePeriod === '30 Hari') {
      const weeks = ['Mgg 1', 'Mgg 2', 'Mgg 3', 'Mgg 4', 'Hari Ini'];
      const varianceFactors = [-0.05, -0.02, 0.01, 0.03, 0.05];
      return weeks.map((w, idx) => {
        const factor = 1 + varianceFactors[idx];
        const val = Math.round(baseAvg * factor);
        const secVal = baseSecAvg > 0 
          ? Math.round(baseSecAvg * (1 + varianceFactors[idx] * 0.75))
          : undefined;
        return {
          label: w,
          dateStr: `Periode ${w} (30 Hari Terakhir)`,
          value: Math.max(1, val),
          secondaryValue: secVal
        };
      });
    }

    if (activePeriod === '3 Bulan') {
      const months3 = ['Bln -2 (A)', 'Bln -2 (B)', 'Bln -1 (A)', 'Bln -1 (B)', 'Bln Ini (A)', 'Bln Ini (B)'];
      const varianceFactors = [-0.08, -0.05, -0.02, 0.02, 0.04, 0.07];
      return months3.map((m, idx) => {
        const factor = 1 + varianceFactors[idx];
        const val = Math.round(baseAvg * factor);
        const secVal = baseSecAvg > 0 
          ? Math.round(baseSecAvg * (1 + varianceFactors[idx] * 0.7))
          : undefined;
        return {
          label: m,
          dateStr: `Triwulan Checkpoint ${m}`,
          value: Math.max(1, val),
          secondaryValue: secVal
        };
      });
    }

    if (activePeriod === '6 Bulan') {
      const months6 = ['Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt'];
      const varianceFactors = [-0.12, -0.07, -0.03, 0.01, 0.05, 0.09];
      return months6.map((m, idx) => {
        const factor = 1 + varianceFactors[idx];
        const val = Math.round(baseAvg * factor);
        const secVal = baseSecAvg > 0 
          ? Math.round(baseSecAvg * (1 + varianceFactors[idx] * 0.65))
          : undefined;
        return {
          label: m,
          dateStr: `Bulan ${m} 2026`,
          value: Math.max(1, val),
          secondaryValue: secVal
        };
      });
    }

    return initialData;
  }, [initialData, activePeriod, periodDataMap]);

  if (!currentData || currentData.length === 0) return null;

  const hasSecondary = Boolean(secondaryLegend && currentData.some(d => d.secondaryValue !== undefined));

  // Compute Metrics
  const primaryValues = currentData.map(d => d.value);
  const primaryAvg = primaryValues.reduce((a, b) => a + b, 0) / primaryValues.length;
  const primaryMax = Math.max(...primaryValues);
  const primaryFirst = primaryValues[0];
  const primaryLast = primaryValues[primaryValues.length - 1];
  const primaryDeltaPercent = primaryFirst !== 0 ? ((primaryLast - primaryFirst) / primaryFirst) * 100 : 0;

  const secondaryValues = hasSecondary ? currentData.map(d => d.secondaryValue || 0) : [];
  const secondaryAvg = hasSecondary && secondaryValues.length > 0
    ? secondaryValues.reduce((a, b) => a + b, 0) / secondaryValues.length
    : 0;

  const svgWidth = 700;
  const svgHeight = height;
  const paddingX = 46;
  const paddingTop = 22;
  const paddingBottom = 32;

  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const minVal = Math.min(...primaryValues) * 0.95;
  const maxVal = Math.max(...primaryValues) * 1.05;
  const valRange = maxVal - minVal || 1;

  const minSec = hasSecondary ? Math.min(...secondaryValues) * 0.92 : 0;
  const maxSec = hasSecondary ? Math.max(...secondaryValues) * 1.08 : 1;
  const secRange = maxSec - minSec || 1;

  const getX = (index: number) => paddingX + (index / (currentData.length - 1)) * chartWidth;
  const getY = (val: number) => paddingTop + chartHeight - ((val - minVal) / valRange) * chartHeight;
  const getSecY = (val: number) => paddingTop + chartHeight - ((val - minSec) / secRange) * chartHeight;

  // Catmull-Rom or Cubic Bezier smooth spline generator
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

  const primaryPoints = currentData.map((d, i) => ({ x: getX(i), y: getY(d.value) }));
  const primaryLinePath = generateSmoothPath(primaryPoints);
  const primaryAreaPath = primaryPoints.length > 0 
    ? `${primaryLinePath} L ${primaryPoints[primaryPoints.length - 1].x} ${paddingTop + chartHeight} L ${primaryPoints[0].x} ${paddingTop + chartHeight} Z`
    : '';

  const secondaryPoints = hasSecondary ? currentData.map((d, i) => ({ x: getX(i), y: getSecY(d.secondaryValue || 0) })) : [];
  const secondaryLinePath = hasSecondary ? generateSmoothPath(secondaryPoints) : '';

  const gridTicks = [0, 0.33, 0.66, 1].map(ratio => {
    const val = minVal + ratio * valRange;
    const y = paddingTop + chartHeight - ratio * chartHeight;
    return { val, y };
  });

  const hoveredData = hoveredIndex !== null ? currentData[hoveredIndex] : null;
  const hoveredPoint = hoveredIndex !== null ? primaryPoints[hoveredIndex] : null;

  const cleanId = title.replace(/[^a-zA-Z0-9]/g, '');

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid var(--border-subtle)',
      borderRadius: '14px',
      padding: '20px 22px',
      position: 'relative'
    }}>
      {/* Header with Title and Period Filter Pills */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0, letterSpacing: '-0.01em' }}>
              {title}
            </h3>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: '6px',
              background: primaryDeltaPercent >= 0 ? '#ECFDF5' : '#FEF2F2',
              color: primaryDeltaPercent >= 0 ? '#047857' : '#DC2626',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              {primaryDeltaPercent >= 0 ? '▲ +' : '▼ '}{primaryDeltaPercent.toFixed(1)}%
            </span>
          </div>
          {subtitle && (
            <p style={{ fontSize: '0.74rem', color: 'var(--slate-500)', margin: '3px 0 0 0' }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Period Pills Filter */}
        {periods.length > 1 && (
          <div style={{ display: 'flex', background: '#F1F5F9', padding: '3px', borderRadius: '8px', gap: '2px' }}>
            {periods.map(p => {
              const isActive = activePeriod === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setActivePeriod(p);
                    setHoveredIndex(null);
                  }}
                  style={{
                    border: 'none',
                    background: isActive ? '#FFFFFF' : 'transparent',
                    color: isActive ? '#0F172A' : '#64748B',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.72rem',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.18s ease'
                  }}
                >
                  {p}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Subtle KPI Summary Strip */}
      <div style={{
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        padding: '8px 0',
        marginBottom: '10px',
        borderBottom: '1px solid #F1F5F9',
        fontSize: '0.76rem',
        color: 'var(--slate-600)'
      }}>
        <div>
          <span style={{ color: 'var(--slate-400)', marginRight: '6px' }}>Rata-rata:</span>
          <strong style={{ color: 'var(--slate-900)' }}>{unit === 'Rp' ? 'Rp ' : ''}{formatValue(Math.round(primaryAvg))} {unit !== 'Rp' ? unit : ''}</strong>
        </div>
        <div>
          <span style={{ color: 'var(--slate-400)', marginRight: '6px' }}>Tertinggi:</span>
          <strong style={{ color: primaryColor }}>{unit === 'Rp' ? 'Rp ' : ''}{formatValue(Math.round(primaryMax))} {unit !== 'Rp' ? unit : ''}</strong>
        </div>
        {hasSecondary && secondaryAvg > 0 && (
          <div>
            <span style={{ color: 'var(--slate-400)', marginRight: '6px' }}>{secondaryLegend}:</span>
            <strong style={{ color: secondaryColor }}>{formatSecondaryValue(Math.round(secondaryAvg))} {secondaryUnit}</strong>
          </div>
        )}
      </div>

      {/* SVG Interactive Canvas */}
      <div key={activePeriod} style={{ position: 'relative', width: '100%', height: `${height}px` }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id={`areaGrad-${cleanId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.18" />
              <stop offset="100%" stopColor={primaryColor} stopOpacity="0.0" />
            </linearGradient>
            <filter id="shadowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Grid lines */}
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
                y={t.y + 3.5}
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
              strokeDasharray="4 3"
              opacity="0.75"
              className="chart-smooth-path"
            />
          )}

          {/* Primary Gradient Area with smooth fade-in */}
          {primaryAreaPath && (
            <path
              d={primaryAreaPath}
              fill={`url(#areaGrad-${cleanId})`}
              className="chart-fade-area"
            />
          )}

          {/* Primary Line with smooth draw-in */}
          {primaryLinePath && (
            <path
              d={primaryLinePath}
              fill="none"
              stroke={primaryColor}
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="chart-draw-line"
            />
          )}

          {/* X Axis Labels */}
          {currentData.map((d, i) => {
            const x = getX(i);
            const isEverySecond = currentData.length > 8 ? i % 2 === 0 : true;
            if (!isEverySecond && i !== currentData.length - 1) return null;
            return (
              <text
                key={i}
                x={x}
                y={paddingTop + chartHeight + 18}
                fill="#94A3B8"
                fontSize="10"
                textAnchor="middle"
                fontWeight={i === currentData.length - 1 ? '700' : '500'}
              >
                {d.label}
              </text>
            );
          })}

          {/* Hover Crosshair & Dots */}
          {hoveredPoint && (
            <g>
              <line
                x1={hoveredPoint.x}
                y1={paddingTop}
                x2={hoveredPoint.x}
                y2={paddingTop + chartHeight}
                stroke="#94A3B8"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r="5"
                fill="#FFFFFF"
                stroke={primaryColor}
                strokeWidth="2.5"
                filter="url(#shadowFilter)"
              />
              {hasSecondary && hoveredIndex !== null && secondaryPoints[hoveredIndex] && (
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

          {/* Hover hitboxes */}
          {currentData.map((_, i) => {
            const colWidth = chartWidth / (currentData.length - 1 || 1);
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

        {/* Hover Tooltip */}
        {hoveredData && hoveredPoint && (
          <div
            style={{
              position: 'absolute',
              left: `${(hoveredPoint.x / svgWidth) * 100}%`,
              top: `${Math.max(4, (hoveredPoint.y / svgHeight) * 100 - 36)}%`,
              transform: 'translate(-50%, -100%)',
              background: '#0F172A',
              color: '#FFFFFF',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 600,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}
          >
            <div style={{ color: '#94A3B8', fontSize: '0.66rem', fontWeight: 500 }}>
              {hoveredData.dateStr || hoveredData.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: primaryColor }} />
              <span>{primaryLegend}: <strong>{unit === 'Rp' ? 'Rp ' : ''}{formatValue(hoveredData.value)} {unit !== 'Rp' ? unit : ''}</strong></span>
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

      {/* Legend Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px', fontSize: '0.72rem', color: 'var(--slate-600)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: primaryColor }} />
          <span>{primaryLegend}</span>
        </div>
        {hasSecondary && secondaryLegend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: secondaryColor }} />
            <span>{secondaryLegend}</span>
          </div>
        )}
      </div>

      <style>{`
        .chart-draw-line {
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
          animation: drawChartLine 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .chart-fade-area {
          opacity: 0;
          animation: fadeInChartArea 0.6s ease-out 0.15s forwards;
        }
        .chart-smooth-path {
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
          animation: drawChartLine 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes drawChartLine {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes fadeInChartArea {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
