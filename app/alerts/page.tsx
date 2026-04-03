"use client"
import { AlertTriangle, AlertCircle, Info, CheckCircle, Bell, Zap, User, DollarSign, Pill, Monitor, Bot, ChevronRight } from 'lucide-react'
import { useState } from 'react'

type Severity = 'CRITICAL' | 'MEDIUM' | 'LOW' | 'ACKNOWLEDGED'

interface AlertData {
    id: number
    severity: Severity
    timeAgo: string
    title: string
    description: string
    tags: ('EMERGENCY' | 'DOCTOR' | 'PATIENT' | 'FINANCE' | 'PHARMACY' | 'SYSTEM')[]
    isLarge?: boolean
}

const alertsData: AlertData[] = [
    {
        id: 1,
        severity: 'CRITICAL',
        timeAgo: '2m ago',
        title: 'Respiratory Distress Detected',
        description: 'Patient session #4429: Significant drop in oxygen saturation levels detected during live conversation.',
        tags: ['EMERGENCY', 'DOCTOR']
    },
    {
        id: 2,
        severity: 'MEDIUM',
        timeAgo: '15m ago',
        title: 'Payment Variance Discrepancy',
        description: 'Transaction ID #XT-991: Quoted insurance co-pay does not match recorded payment amount in session.',
        tags: ['PATIENT', 'FINANCE']
    },
    {
        id: 3,
        severity: 'LOW',
        timeAgo: '2h ago',
        title: 'Follow-up Reminder Trigger',
        description: 'Patient mentioned needing a referral for dermatology during session. Auto-scheduled follow-up created.',
        tags: ['SYSTEM']
    },
    {
        id: 4,
        severity: 'CRITICAL',
        timeAgo: 'Just now',
        title: 'Medication Allergy Conflict',
        description: 'System identified a prescription intent for Penicillin while Patient History indicates severe allergic reaction. Urgent intervention required.',
        tags: ['EMERGENCY', 'PHARMACY'],
        isLarge: true
    },
    {
        id: 5,
        severity: 'MEDIUM',
        timeAgo: '3h ago',
        title: 'Swelling in Ankle Detected',
        description: 'Patient has mentioned a swelling in this left ankle when he work up from sleep',
        tags: ['EMERGENCY', 'PHARMACY'],
        isLarge: false
    },
    {
        id: 6,
        severity: 'ACKNOWLEDGED',
        timeAgo: '2h ago',
        title: 'Identity Verification Success',
        description: 'Voice biometric match confirmed for User ID #9822 during secure financial session.',
        tags: ['SYSTEM']
    }
]

const tagIcons = {
    EMERGENCY: Zap,
    DOCTOR: User,
    PATIENT: User,
    FINANCE: DollarSign,
    PHARMACY: Pill,
    SYSTEM: Monitor
}

const tagColors = {
    EMERGENCY: 'bg-red-500/20 text-red-400',
    DOCTOR: 'bg-blue-500/20 text-blue-400',
    PATIENT: 'bg-teal-500/20 text-teal-400',
    FINANCE: 'bg-amber-500/20 text-amber-400',
    PHARMACY: 'bg-purple-500/20 text-purple-400',
    SYSTEM: 'bg-gray-500/20 text-gray-400'
}

const severityBadgeColors = {
    CRITICAL: 'bg-red-500/20 text-red-400',
    MEDIUM: 'bg-amber-500/20 text-amber-400',
    LOW: 'bg-gray-500/20 text-gray-400',
    ACKNOWLEDGED: 'bg-gray-700/30 text-gray-500'
}

const AlertsCenterPage = () => {
    const [activeFilter, setActiveFilter] = useState<'All' | 'Critical' | 'Medium' | 'Low' | 'Acknowledged'>('All')
    const [alerts, setAlerts] = useState<AlertData[]>(alertsData)
    const [acknowledgedIds, setAcknowledgedIds] = useState<number[]>([])

    const unresolvedCritical = alerts.filter(a => a.severity === 'CRITICAL' && !acknowledgedIds.includes(a.id)).length

    const filteredAlerts = alerts.filter(alert => {
        if (activeFilter === 'All') return true
        if (activeFilter === 'Critical') return alert.severity === 'CRITICAL'
        if (activeFilter === 'Medium') return alert.severity === 'MEDIUM'
        if (activeFilter === 'Low') return alert.severity === 'LOW'
        if (activeFilter === 'Acknowledged') return acknowledgedIds.includes(alert.id) || alert.severity === 'ACKNOWLEDGED'
        return true
    })

    const handleAcknowledge = (id: number) => {
        setAcknowledgedIds([...acknowledgedIds, id])
    }

    const getSeverityIcon = (severity: Severity) => {
        switch (severity) {
            case 'CRITICAL': return <AlertTriangle size={16} />
            case 'MEDIUM': return <AlertCircle size={16} />
            case 'LOW': return <Info size={16} />
            case 'ACKNOWLEDGED': return <CheckCircle size={16} />
        }
    }

    return (
        <div className='h-[95vh] w-full flex flex-col bg-black font-lexend'>
            <div className='h-full w-full flex flex-col items-center justify-center p-4'>
                {/* PAGE HEADER */}
                <div className='w-full h-fit flex flex-col gap-4 p-4'>
                    <div className='flex items-start justify-between'>
                        <div>
                            <h1 className='text-3xl font-semibold text-white font-oxanium'>Alerts Center</h1>
                            <p className='text-sm text-[#9d9d9d] mt-2 max-w-xl'>
                                Monitor real-time critical health and financial triggers across all active conversational sessions.
                            </p>
                        </div>
                        {/* Unresolved Critical Count Badge */}
                        <div className='flex items-center gap-3 bg-[#0f0e10] rounded-xl px-4 py-3 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]'>
                            <AlertTriangle size={20} className='text-red-500' />
                            <div className='flex items-center gap-2'>
                                <span className='text-3xl font-bold text-red-500 font-oxanium'>{unresolvedCritical}</span>
                                <span className='text-xs text-[#9d9d9d] font-mono uppercase tracking-wider'>Unresolved Critical</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FILTER TABS */}
                <div className='w-full h-fit flex items-center justify-start gap-4 p-4'>
                    {(['All', 'Critical', 'Medium', 'Low', 'Acknowledged'] as const).map((filter, index) => (
                        <div key={index} className='h-full w-fit p-4' onClick={() => setActiveFilter(filter)}>
                            <span className={`text-xl font-semibold text-white ${activeFilter === filter ? "border-b-4 border-white" : ""} p-2`}>{filter}</span>
                        </div>
                    ))}
                </div>

                {/* ALERT CARDS GRID */}
                <div className='w-full h-fit flex-1 overflow-y-auto p-4'>
                    <div className='grid grid-cols-3 gap-4'>
                        {filteredAlerts.map((alert) => {
                            const isAcknowledged = acknowledgedIds.includes(alert.id) || alert.severity === 'ACKNOWLEDGED'
                            const isLarge = alert.isLarge

                            return (
                                <div
                                    key={alert.id}
                                    className={`${isLarge ? 'col-span-3' : 'col-span-1'}
                                        bg-[#0a0a0a] rounded-2xl p-4 flex flex-col gap-3
                                        ${alert.severity === 'CRITICAL' && !isAcknowledged
                                            ? 'border-l-4 border-red-500'
                                            : ''}
                                        ${alert.severity === 'CRITICAL' && !isAcknowledged
                                            ? 'bg-[rgba(239,68,68,0.05)]'
                                            : ''}
                                        transition-all duration-300`}
                                >
                                    {/* TOP ROW: Severity Badge + Time */}
                                    <div className='flex items-center justify-between'>
                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${severityBadgeColors[isAcknowledged ? 'ACKNOWLEDGED' : alert.severity]}`}>
                                            {getSeverityIcon(isAcknowledged ? 'ACKNOWLEDGED' : alert.severity)}
                                            <span className='text-xs font-semibold uppercase tracking-wider'>
                                                {isAcknowledged ? 'Acknowledged' : alert.severity}
                                            </span>
                                        </div>
                                        <span className='text-xs text-[#9d9d9d] font-mono'>{alert.timeAgo}</span>
                                    </div>

                                    {/* TITLE */}
                                    <h2 className={`text-white font-semibold font-oxanium ${isLarge ? 'text-xl' : 'text-lg'}`}>
                                        {alert.title}
                                    </h2>

                                    {/* DESCRIPTION */}
                                    <p className={`text-[#9d9d9d] text-sm line-clamp-3 ${isAcknowledged ? 'opacity-50' : ''}`}>
                                        {alert.description}
                                    </p>

                                    {/* RECIPIENT TAGS */}
                                    <div className='flex flex-wrap gap-2'>
                                        {alert.tags.map((tag) => {
                                            const TagIcon = tagIcons[tag]
                                            return (
                                                <div key={tag} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${tagColors[tag]}`}>
                                                    <TagIcon size={12} />
                                                    {tag}
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* ACTION BUTTON */}
                                    {isAcknowledged ? (
                                        <div className='flex items-center gap-2 text-[#9d9d9d] text-sm pt-2'>
                                            <Bot size={14} />
                                            <span>Handled by System</span>
                                        </div>
                                    ) : isLarge ? (
                                        <div className='flex gap-2 pt-2'>
                                            <button className='flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl text-sm font-semibold transition-all duration-200'>
                                                Immediate Override
                                            </button>
                                            <button className='flex-1 bg-[#1a1a1a] hover:bg-[#2c2c2c] text-white border border-[#2c2c2c] py-2 rounded-xl text-sm font-semibold transition-all duration-200'>
                                                Review Session
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleAcknowledge(alert.id)}
                                            className='w-full bg-[#1a1a1a] hover:bg-[#2c2c2c] text-white py-2 rounded-xl text-sm font-semibold transition-all duration-200 border border-[#2c2c2c]'
                                        >
                                            Acknowledge Alert
                                        </button>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* ALERT TRENDS SECTION */}
                <div className='w-full h-fit p-4'>
                    <div className='bg-[#0a0a0a] rounded-2xl p-4'>
                        <div className='flex items-center justify-between mb-4'>
                            <div>
                                <h1 className='text-2xl font-semibold text-white font-oxanium'>Alert Trends</h1>
                                <p className='text-sm text-[#9d9d9d] mt-1'>
                                    Response time has improved by 12% in the last 24 hours.
                                </p>
                            </div>
                        </div>

                        {/* STAT BOXES */}
                        <div className='grid grid-cols-4 gap-4 mb-6'>
                            <div className='bg-[#1a1a1a] rounded-xl p-4'>
                                <div className='text-3xl font-bold text-white font-oxanium'>1.4m</div>
                                <div className='text-xs text-[#9d9d9d] font-mono uppercase mt-1'>Avg Response</div>
                            </div>
                            <div className='bg-[#1a1a1a] rounded-xl p-4'>
                                <div className='text-3xl font-bold text-white font-oxanium'>2.1%</div>
                                <div className='text-xs text-[#9d9d9d] font-mono uppercase mt-1'>False Positives</div>
                            </div>
                            <div className='bg-[#1a1a1a] rounded-xl p-4'>
                                <div className='text-3xl font-bold text-white font-oxanium'>142</div>
                                <div className='text-xs text-[#9d9d9d] font-mono uppercase mt-1'>Sessions Active</div>
                            </div>
                            <div className='bg-[#1a1a1a] rounded-xl p-4'>
                                <div className='text-3xl font-bold text-white font-oxanium'>22/22</div>
                                <div className='text-xs text-[#9d9d9d] font-mono uppercase mt-1'>Nodes Online</div>
                            </div>
                        </div>

                        {/* PROGRESS BAR */}
                        <div className='flex items-center gap-4'>
                            <span className='text-sm text-[#9d9d9d] font-mono'>System Load: 74%</span>
                            <div className='flex-1 h-2 bg-[#1a1a1a] rounded-full overflow-hidden'>
                                <div className='h-full w-[74%] bg-[#2b7fff] rounded-full' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AlertsCenterPage
