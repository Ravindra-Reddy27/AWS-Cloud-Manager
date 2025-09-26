import React, { useState, useEffect } from 'react';
import {
    Play, Square, Trash2, Server, Database, RefreshCw, AlertCircle, Activity,
    Cpu, HardDrive, Clock, Shield, Zap, Folder, File, ChevronRight,
    ArrowLeft, X, FolderOpen, Network
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

// Comprehensive styles object for the enhanced S3 manager
const styles = {
    // Container and background
    awsContainer: {
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        background: '#0f1419',
    },
    backgroundBase: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url(/aws_background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: -3,
    },
    backgroundBlur: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backdropFilter: 'blur(8px)',
        background: 'linear-gradient(135deg, rgba(15, 20, 25, 0.8) 0%, rgba(15, 20, 25, 0.4) 40%, rgba(15, 20, 25, 0.1) 50%, rgba(15, 20, 25, 0.4) 60%, rgba(15, 20, 25, 0.8) 100%)',
        zIndex: -2,
    },
    logoSpotlight: {
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '300px',
        height: '180px',
        background: 'radial-gradient(ellipse at center, rgba(255, 153, 0, 0.15) 0%, rgba(255, 153, 0, 0.08) 40%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(20px)',
        zIndex: -1,
        animation: 'pulse 4s ease-in-out infinite',
    },
    contentContainer: {
        position: 'relative',
        zIndex: 1,
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem',
        paddingTop: '280px',
    },

    // Header styles
    headerSection: {
        textAlign: 'center',
        marginBottom: '3rem',
        position: 'relative',
    },
    mainTitle: {
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #FF9900 0%, #FFAA33 30%, #FFD700 60%, #FF9900 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '0.5rem',
        textShadow: '0 4px 20px rgba(255, 153, 0, 0.3)',
        letterSpacing: '-0.02em',
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '1.125rem',
        fontWeight: '400',
        maxWidth: '600px',
        margin: '0 auto',
        lineHeight: '1.6',
    },

    // Tab navigation
    tabContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2.5rem',
    },
    tabWrapper: {
        display: 'flex',
        background: 'rgba(35, 47, 62, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: '6px',
        border: '1px solid rgba(255, 153, 0, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    },
    tabButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 24px',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: 'inherit',
        fontWeight: '500',
        fontSize: '1rem',
        minWidth: '160px',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    tabActive: {
        background: 'linear-gradient(135deg, #FF9900 0%, #FFAA33 100%)',
        color: '#0f1419',
        boxShadow: '0 4px 20px rgba(255, 153, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.2)',
        transform: 'translateY(-2px)',
    },
    tabInactive: {
        color: 'rgba(255, 255, 255, 0.7)',
        background: 'transparent',
    },

    // S3 Navigation
    s3Navigation: {
        background: 'rgba(35, 47, 62, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        border: '1px solid rgba(255, 153, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    breadcrumb: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '0.875rem',
        flex: '1',
    },
    breadcrumbItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
    },
    breadcrumbSeparator: {
        color: 'rgba(255, 153, 0, 0.6)',
    },
    backButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        background: 'rgba(15, 20, 25, 0.8)',
        color: '#FF9900',
        border: '1px solid rgba(255, 153, 0, 0.3)',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: '500',
        transition: 'all 0.3s ease',
    },

    // Content list
    contentList: {
        background: 'rgba(26, 35, 50, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 153, 0, 0.2)',
        overflow: 'hidden',
    },
    listHeader: {
        display: 'grid',
        gridTemplateColumns: '1fr auto auto auto',
        gap: '1rem',
        padding: '1rem 1.25rem',
        background: 'rgba(15, 20, 25, 0.6)',
        borderBottom: '1px solid rgba(255, 153, 0, 0.1)',
        fontWeight: '600',
        fontSize: '0.875rem',
        color: 'rgba(255, 255, 255, 0.8)',
    },
    listItem: {
        display: 'grid',
        gridTemplateColumns: '1fr auto auto auto',
        gap: '1rem',
        padding: '1rem 1.25rem',
        borderBottom: '1px solid rgba(255, 153, 0, 0.05)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        alignItems: 'center',
    },
    listItemHover: {
        background: 'rgba(255, 153, 0, 0.05)',
    },
    itemInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
    },
    itemIcon: {
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemName: {
        color: '#ffffff',
        fontWeight: '500',
        fontSize: '0.875rem',
    },
    itemSize: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '0.75rem',
        fontFamily: '"JetBrains Mono", monospace',
    },
    itemModified: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '0.75rem',
        fontFamily: '"JetBrains Mono", monospace',
    },
    itemActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    actionIcon: {
        padding: '0.25rem',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        color: 'rgba(255, 255, 255, 0.6)',
    },
    actionIconHover: {
        background: 'rgba(239, 68, 68, 0.2)',
        color: '#EF4444',
    },

    // Modal styles
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(5px)',
    },
    modalContent: {
        background: 'linear-gradient(145deg, rgba(26, 35, 50, 0.95) 0%, rgba(15, 20, 25, 0.9) 100%)',
        border: '1px solid rgba(255, 153, 0, 0.3)',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '500px',
        width: '90%',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    },
    modalHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.5rem',
    },
    modalTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#ffffff',
        flex: 1,
    },
    modalClose: {
        padding: '0.5rem',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        color: 'rgba(255, 255, 255, 0.6)',
    },
    modalBody: {
        marginBottom: '2rem',
    },
    modalText: {
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: '1.5',
        marginBottom: '1rem',
    },
    modalHighlight: {
        color: '#FF9900',
        fontWeight: '600',
        fontFamily: '"JetBrains Mono", monospace',
    },
    modalActions: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'flex-end',
    },
    modalButton: {
        padding: '0.75rem 1.5rem',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontWeight: '500',
        fontSize: '0.875rem',
        transition: 'all 0.3s ease',
    },
    modalButtonCancel: {
        background: 'rgba(108, 117, 125, 0.2)',
        color: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid rgba(108, 117, 125, 0.3)',
    },
    modalButtonDelete: {
        background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
        color: '#ffffff',
        border: 'none',
    },

    // Cards and other existing styles
    cardsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '2rem',
        alignItems: 'start',
    },
    serviceCard: {
        background: 'linear-gradient(145deg, rgba(26, 35, 50, 0.95) 0%, rgba(15, 20, 25, 0.9) 100%)',
        border: '1px solid rgba(255, 153, 0, 0.2)',
        borderRadius: '20px',
        padding: '1.75rem',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255, 153, 0, 0.05)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
    },
    serviceCardHover: {
        transform: 'translateY(-8px) scale(1.02)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 153, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        borderColor: 'rgba(255, 153, 0, 0.4)',
    },

    // Button styles
    refreshButton: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 24px',
        background: 'rgba(35, 47, 62, 0.9)',
        color: '#ffffff',
        border: '1px solid rgba(255, 153, 0, 0.3)',
        borderRadius: '12px',
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontWeight: '500',
        fontSize: '1rem',
        marginBottom: '2.5rem',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    },
    refreshButtonHover: {
        borderColor: '#FF9900',
        boxShadow: '0 6px 25px rgba(255, 153, 0, 0.2)',
        transform: 'translateY(-2px)',
    },
    refreshButtonDisabled: {
        opacity: '0.6',
        cursor: 'not-allowed',
    },

    // Error and empty states
    errorContainer: {
        marginBottom: '2rem',
        background: 'rgba(248, 113, 113, 0.1)',
        border: '1px solid rgba(248, 113, 113, 0.3)',
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        backdropFilter: 'blur(10px)',
    },
    errorContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: '#F87171',
        fontSize: '1rem',
    },
    emptyState: {
        gridColumn: '1 / -1',
        textAlign: 'center',
        padding: '4rem 2rem',
        background: 'rgba(26, 35, 50, 0.6)',
        border: '2px dashed rgba(255, 153, 0, 0.3)',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
    },
    emptyIcon: {
        marginBottom: '1.5rem',
        opacity: '0.6',
    },
    emptyText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '1.125rem',
        fontWeight: '500',
    },
};

const VPCCard = ({ vpc }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <article
            style={{ ...styles.serviceCard, ...(isHovered ? styles.serviceCardHover : {}) }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)' }}>
                        <Network size={24} color="#ffffff" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>{vpc.Name}</h3>
                        <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', fontFamily: '"JetBrains Mono", monospace' }}>{vpc.VpcId}</p>
                    </div>
                </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 20, 25, 0.8)', padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(255, 153, 0, 0.2)' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: vpc.State === 'available' ? '#10B981' : '#F59E0B', boxShadow: `0 0 10px ${vpc.State === 'available' ? '#10B981' : '#F59E0B'}`}}></div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', textTransform: 'capitalize', color: vpc.State === 'available' ? '#10B981' : '#F59E0B' }}>
                        {vpc.State}
                    </span>
                </div>
            </header>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                 <div style={{ background: 'rgba(15, 20, 25, 0.5)', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255, 153, 0, 0.1)' }}>
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>CIDR Block</div>
                    <div style={{ color: '#ffffff', fontWeight: '600', fontFamily: '"JetBrains Mono", monospace' }}>{vpc.CidrBlock}</div>
                </div>
                <div style={{ background: 'rgba(15, 20, 25, 0.5)', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255, 153, 0, 0.1)' }}>
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>Tenancy</div>
                    <div style={{ color: '#ffffff', fontWeight: '600', textTransform: 'capitalize' }}>{vpc.Tenancy}</div>
                </div>
            </div>
             <div style={{ marginTop: '1rem', background: 'rgba(15, 20, 25, 0.5)', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255, 153, 0, 0.1)' }}>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>Default VPC</div>
                <div style={{ color: vpc.IsDefault ? '#10B981' : '#ffffff', fontWeight: '600' }}>{vpc.IsDefault ? 'Yes' : 'No'}</div>
            </div>
        </article>
    );
};


// VPC Visualization Component (embedded)
const VPCVisualization = () => {
    const [vpcs, setVpcs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchVpcs = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_BASE_URL}/vpc/vpcs`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch VPCs');
            }
            
            setVpcs(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVpcs();
    }, []);

    const filteredVpcs = vpcs.filter(vpc =>
        (vpc.Name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (vpc.VpcId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (vpc.CidrBlock || '').includes(searchTerm)
    );

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
                color: '#FF9900'
            }}>
                <RefreshCw className="animate-spin" size={32} />
                <span style={{ marginLeft: '1rem' }}>Loading VPC data...</span>
            </div>
        );
    }
    
    const refreshButtonStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 24px',
        background: 'rgba(35, 47, 62, 0.9)',
        color: '#ffffff',
        border: '1px solid rgba(255, 153, 0, 0.3)',
        borderRadius: '12px',
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontWeight: '500',
        fontSize: '1rem',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    };

    return (
        <div style={{ color: 'white' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                padding: '1rem 0',
                borderBottom: '1px solid rgba(255, 153, 0, 0.1)'
            }}>
                <div>
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: '#FF9900',
                        marginBottom: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <Network size={24} />
                        VPC & Network Topology
                    </h2>
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.9rem'
                    }}>
                        Manage your Virtual Private Clouds and subnet configurations
                    </p>
                </div>
                <button
                    style={refreshButtonStyle}
                    onClick={fetchVpcs}
                    disabled={loading}
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>
            <div style={{
                marginBottom: '2rem',
                display: 'flex',
                gap: '1rem'
            }}>
                 <input
                    type="text"
                    placeholder="Search by VPC name, ID, or CIDR block..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '12px 16px',
                        background: 'rgba(15, 20, 25, 0.8)',
                        border: '1px solid rgba(255, 153, 0, 0.3)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '1rem',
                    }}
                />
            </div>

            {error && (
                 <div style={{ ...styles.errorContainer, marginTop: '2rem' }}>
                    <div style={styles.errorContent}><AlertCircle size={20} /><span>{error}</span></div>
                </div>
            )}
            
            <div style={styles.cardsGrid}>
                {filteredVpcs.length > 0 ? (
                    filteredVpcs.map((vpc) => <VPCCard key={vpc.VpcId} vpc={vpc} />)
                ) : !loading && (
                     <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>
                            <Network size={64} color="rgba(255, 255, 255, 0.4)" />
                        </div>
                        <p style={styles.emptyText}>
                            {searchTerm ? `No VPCs found for "${searchTerm}"` : "No VPCs found"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};


const AWSManager = () => {
    const [instances, setInstances] = useState([]);
    const [buckets, setBuckets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('ec2');
    const [selectedBucket, setSelectedBucket] = useState(null);
    const [bucketContents, setBucketContents] = useState({ folders: [], files: [] });
    const [currentPath, setCurrentPath] = useState('');
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);
    const [breadcrumbs, setBreadcrumbs] = useState([]);

    // API functions
    const fetchInstances = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_BASE_URL}/ec2/instances`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch instances');
            }

            const activeInstances = data.filter(instance => instance.State !== 'terminated');
            setInstances(activeInstances);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchBuckets = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_BASE_URL}/s3/buckets`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch buckets');
            }

            setBuckets(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // S3 content management functions
    const fetchBucketContents = async (bucketName, prefix = '') => {
        try {
            setLoading(true);
            setError(null);
            const encodedPrefix = encodeURIComponent(prefix);
            const response = await fetch(`${API_BASE_URL}/s3/buckets/${bucketName}/objects?prefix=${encodedPrefix}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch bucket contents');
            }

            setBucketContents({
                folders: data.folders || [],
                files: data.files || []
            });
            setCurrentPath(data.currentPrefix || '');

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBucketClick = (bucket) => {
        setSelectedBucket(bucket);
        setCurrentPath('');
        fetchBucketContents(bucket.Name);
    };

    const handleFolderClick = (folder) => {
        fetchBucketContents(selectedBucket.Name, folder.FullPath);
    };

    const handleBreadcrumbClick = (path) => {
        fetchBucketContents(selectedBucket.Name, path);
    };

    const handleBackNavigation = () => {
        setSelectedBucket(null);
        setBucketContents({ folders: [], files: [] });
        setCurrentPath('');
    };

    const handleDeleteFile = async (file) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/s3/buckets/${selectedBucket.Name}/objects/${encodeURIComponent(file.FullPath)}`,
                { method: 'DELETE' }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete file');
            }

            fetchBucketContents(selectedBucket.Name, currentPath);
            setDeleteConfirmation(null);
        } catch (err) {
            setError(err.message);
            setDeleteConfirmation(null);
        }
    };

    const handleDeleteFolder = async (folder) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/s3/buckets/${selectedBucket.Name}/folders/${encodeURIComponent(folder.FullPath)}`,
                { method: 'DELETE' }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete folder');
            }

            fetchBucketContents(selectedBucket.Name, currentPath);
            setDeleteConfirmation(null);
        } catch (err) {
            setError(err.message);
            setDeleteConfirmation(null);
        }
    };

    const handleDeleteBucket = async (bucket) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/s3/buckets/${bucket.Name}`,
                { method: 'DELETE' }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete bucket');
            }

            fetchBuckets();
            setDeleteConfirmation(null);
        } catch (err) {
            setError(err.message);
            setDeleteConfirmation(null);
        }
    };

    const handleInstanceAction = async (instanceId, action) => {
        try {
            const response = await fetch(`${API_BASE_URL}/ec2/${action}/${instanceId}`, {
                method: 'POST'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Failed to ${action} instance`);
            }

            if (action === 'terminate') {
                setInstances(prev => prev.filter(inst => inst.InstanceId !== instanceId));
            } else {
                setTimeout(fetchInstances, 2000);
            }

        } catch (err) {
            setError(err.message);
        }
    };
    
    // Generate breadcrumbs from the current path
    useEffect(() => {
        if (currentPath) {
            const pathParts = currentPath.split('/').filter(p => p);
            const crumbs = pathParts.map((part, index) => {
                const path = pathParts.slice(0, index + 1).join('/') + '/';
                return { name: part, path: path };
            });
            setBreadcrumbs(crumbs);
        } else {
            setBreadcrumbs([]);
        }
    }, [currentPath]);

    useEffect(() => {
        if (activeTab === 'ec2') {
            fetchInstances();
        } else if (activeTab === 's3') {
            fetchBuckets();
        }
        // VPC component handles its own data fetching
    }, [activeTab]);

    // Enhanced breadcrumb component
    const BreadcrumbNavigation = () => {
        return (
            <div style={styles.breadcrumb}>
                <Database size={16} color="#FF9900" />
                <span
                    style={{
                        cursor: 'pointer',
                        color: currentPath ? 'rgba(255, 255, 255, 0.6)' : '#FF9900',
                        fontWeight: currentPath ? '400' : '500',
                    }}
                    onClick={() => handleBreadcrumbClick('')}
                >
                    {selectedBucket.Name}
                </span>
                {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                        <ChevronRight size={14} style={styles.breadcrumbSeparator} />
                        <span
                            style={{
                                cursor: 'pointer',
                                color: index === breadcrumbs.length - 1 ? '#FF9900' : 'rgba(255, 255, 255, 0.6)',
                                fontWeight: index === breadcrumbs.length - 1 ? '500' : '400',
                            }}
                            onClick={() => handleBreadcrumbClick(crumb.path)}
                        >
                            {crumb.name}
                        </span>
                    </React.Fragment>
                ))}
            </div>
        );
    };

    // Enhanced folder card component
    const FolderCard = ({ folder }) => {
        const [isHovered, setIsHovered] = useState(false);

        return (
            <div
                style={{
                    ...styles.listItem,
                    ...(isHovered ? styles.listItemHover : {})
                }}
                onClick={() => handleFolderClick(folder)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div style={styles.itemInfo}>
                    <div style={styles.itemIcon}>
                        <Folder size={20} color="#FF9900" />
                    </div>
                    <div>
                        <div style={styles.itemName}>{folder.Name}</div>
                        <div style={{
                            fontSize: '0.7rem',
                            color: 'rgba(255, 255, 255, 0.5)',
                            marginTop: '2px'
                        }}>
                            {folder.FileCount || 0} items
                        </div>
                    </div>
                </div>
                <div style={styles.itemSize}>{folder.Size || '—'}</div>
                <div style={styles.itemModified}>—</div>
                <div style={styles.itemActions}>
                    <div
                        style={styles.actionIcon}
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmation({
                                type: 'folder',
                                item: folder,
                                title: 'Delete Folder',
                                message: `Are you sure you want to delete the folder "${folder.Name}"? This action cannot be undone. The folder must be empty to be deleted.`
                            });
                        }}
                    >
                        <Trash2 size={16} />
                    </div>
                </div>
            </div>
        );
    };

    // Enhanced file card component
    const FileCard = ({ file }) => {
        const [isHovered, setIsHovered] = useState(false);

        const getFileIcon = (fileName) => {
            const ext = fileName.split('.').pop()?.toLowerCase();
            const iconColor = {
                'jpg': '#FF6B6B',
                'jpeg': '#FF6B6B',
                'png': '#FF6B6B',
                'gif': '#FF6B6B',
                'pdf': '#FF4757',
                'doc': '#4834D4',
                'docx': '#4834D4',
                'txt': '#A0AEC0',
                'csv': '#10AC84',
                'json': '#F79F1F'
            }[ext] || '#10B981';

            return <File size={20} color={iconColor} />;
        };

        return (
            <div
                style={{
                    ...styles.listItem,
                    ...(isHovered ? styles.listItemHover : {})
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div style={styles.itemInfo}>
                    <div style={styles.itemIcon}>
                        {getFileIcon(file.Name)}
                    </div>
                    <div>
                        <div style={styles.itemName}>{file.Name}</div>
                        <div style={{
                            fontSize: '0.7rem',
                            color: 'rgba(255, 255, 255, 0.5)',
                            marginTop: '2px'
                        }}>
                            File
                        </div>
                    </div>
                </div>
                <div style={styles.itemSize}>{file.Size}</div>
                <div style={styles.itemModified}>
                    {new Date(file.LastModified).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </div>
                <div style={styles.itemActions}>
                    <div
                        style={styles.actionIcon}
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmation({
                                type: 'file',
                                item: file,
                                title: 'Delete File',
                                message: `Are you sure you want to delete "${file.Name}"? This action cannot be undone.`,
                                details: `Size: ${file.Size} | Last modified: ${new Date(file.LastModified).toLocaleString()}`
                            });
                        }}
                    >
                        <Trash2 size={16} />
                    </div>
                </div>
            </div>
        );
    };
    
    // Render S3 browser view
    const renderS3Browser = () => {
        if (selectedBucket) {
            const totalItems = bucketContents.folders.length + bucketContents.files.length;

            return (
                <div>
                    {/* Enhanced Navigation bar */}
                    <div style={styles.s3Navigation}>
                        <BreadcrumbNavigation />
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <div style={{
                                fontSize: '0.875rem',
                                color: 'rgba(255, 255, 255, 0.6)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <Activity size={14} />
                                {totalItems} items
                            </div>
                            <button
                                style={styles.backButton}
                                onClick={handleBackNavigation}
                                title="Back to bucket list"
                            >
                                <ArrowLeft size={16} />
                                <span>Buckets</span>
                            </button>
                        </div>
                    </div>

                    {/* Enhanced Content list */}
                    <div style={styles.contentList}>
                        <div style={styles.listHeader}>
                            <div>Name</div>
                            <div>Size</div>
                            <div>Modified</div>
                            <div>Actions</div>
                        </div>

                        {/* Folders */}
                        {bucketContents.folders.map((folder) => (
                            <FolderCard key={folder.FullPath} folder={folder} />
                        ))}

                        {/* Files */}
                        {bucketContents.files.map((file) => (
                            <FileCard key={file.FullPath} file={file} />
                        ))}

                        {/* Enhanced empty state */}
                        {totalItems === 0 && (
                            <div style={{ ...styles.emptyState, margin: '3rem 2rem' }}>
                                <div style={styles.emptyIcon}>
                                    <FolderOpen size={64} color="rgba(255, 255, 255, 0.3)" />
                                </div>
                                <h3 style={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontSize: '1.25rem',
                                    fontWeight: '600',
                                    margin: '1rem 0 0.5rem 0'
                                }}>
                                    {currentPath ? 'Empty Folder' : 'Empty Bucket'}
                                </h3>
                                <p style={styles.emptyText}>
                                    {currentPath
                                        ? 'This folder contains no files or subfolders.'
                                        : 'This bucket is empty. Upload files to get started.'}
                                </p>
                            </div>
                        )}

                        {/* Summary footer for non-empty containers */}
                        {totalItems > 0 && (
                            <div style={{
                                padding: '1rem 1.25rem',
                                background: 'rgba(15, 20, 25, 0.4)',
                                borderTop: '1px solid rgba(255, 153, 0, 0.1)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '0.875rem',
                                color: 'rgba(255, 255, 255, 0.6)'
                            }}>
                                <span>
                                    {bucketContents.folders.length} folders, {bucketContents.files.length} files
                                </span>
                                <span>
                                    Total: {totalItems} items
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // Bucket list view
        return (
            <div style={styles.cardsGrid}>
                {buckets.length > 0 ? (
                    buckets.map((bucket) => (
                        <BucketCard
                            key={bucket.Name}
                            bucket={bucket}
                            onBucketClick={handleBucketClick}
                            onDeleteBucket={(bucket) => setDeleteConfirmation({
                                type: 'bucket',
                                item: bucket,
                                title: 'Delete Bucket',
                                message: `Are you sure you want to delete the bucket "${bucket.Name}"? This action cannot be undone and the bucket must be empty.`
                            })}
                        />
                    ))
                ) : (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>
                            <Database size={64} color="rgba(255, 255, 255, 0.4)" />
                        </div>
                        <p style={styles.emptyText}>No S3 buckets found</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={styles.awsContainer}>
            {/* Background layers */}
            <div style={styles.backgroundBase}></div>
            <div style={styles.backgroundBlur}></div>
            <div style={styles.logoSpotlight}></div>

            {/* Main content */}
            <div style={styles.contentContainer}>
                {/* Header */}
                <header style={styles.headerSection}>
                    <h1 style={styles.mainTitle}>AWS Cloud Manager</h1>
                    <p style={styles.subtitle}>
                        Enterprise-grade infrastructure management with real-time monitoring and control
                    </p>
                </header>

                {/* Navigation tabs */}
                <nav style={styles.tabContainer}>
                    <div style={styles.tabWrapper}>
                        <button
                            style={{
                                ...styles.tabButton,
                                ...(activeTab === 'ec2' ? styles.tabActive : styles.tabInactive)
                            }}
                            onClick={() => setActiveTab('ec2')}
                        >
                            <Server size={20} />
                            <span>EC2 Instances</span>
                        </button>
                        <button
                            style={{
                                ...styles.tabButton,
                                ...(activeTab === 's3' ? styles.tabActive : styles.tabInactive)
                            }}
                            onClick={() => setActiveTab('s3')}
                        >
                            <Database size={20} />
                            <span>S3 Storage</span>
                        </button>
                        <button
                            style={{
                                ...styles.tabButton,
                                ...(activeTab === 'vpc' ? styles.tabActive : styles.tabInactive)
                            }}
                            onClick={() => setActiveTab('vpc')}
                        >
                            <Network size={20} />
                            <span>VPC & Networking</span>
                        </button>
                    </div>
                </nav>

                {/* Refresh button */}
                {activeTab !== 'vpc' && (
                    <button
                        style={{
                            ...styles.refreshButton,
                            ...(loading ? styles.refreshButtonDisabled : {})
                        }}
                        onClick={selectedBucket ?
                            () => fetchBucketContents(selectedBucket.Name, currentPath) :
                            (activeTab === 'ec2' ? fetchInstances : fetchBuckets)
                        }
                        disabled={loading}
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        <span>{loading ? 'Loading...' : 'Refresh Data'}</span>
                    </button>
                )}

                {/* Error display */}
                {error && (
                    <div style={styles.errorContainer}>
                        <div style={styles.errorContent}>
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {/* Content area */}
                <main>
                    {activeTab === 'ec2' ? (
                        <div style={styles.cardsGrid}>
                            {instances.length > 0 ? (
                                instances.map((instance) => (
                                    <InstanceCard
                                        key={instance.InstanceId}
                                        instance={instance}
                                        onAction={handleInstanceAction}
                                    />
                                ))
                            ) : (
                                <div style={styles.emptyState}>
                                    <div style={styles.emptyIcon}>
                                        <Server size={64} color="rgba(255, 255, 255, 0.4)" />
                                    </div>
                                    <p style={styles.emptyText}>No EC2 instances found</p>
                                </div>
                            )}
                        </div>
                    ) : activeTab === 'vpc' ? (
                        <VPCVisualization />
                    ) : (
                        renderS3Browser()
                    )}
                </main>

                {/* Delete confirmation modal */}
                {deleteConfirmation && (
                    <DeleteConfirmationModal
                        confirmation={deleteConfirmation}
                        onConfirm={() => {
                            if (deleteConfirmation.type === 'file') {
                                handleDeleteFile(deleteConfirmation.item);
                            } else if (deleteConfirmation.type === 'folder') {
                                handleDeleteFolder(deleteConfirmation.item);
                            } else if (deleteConfirmation.type === 'bucket') {
                                handleDeleteBucket(deleteConfirmation.item);
                            }
                        }}
                        onCancel={() => setDeleteConfirmation(null)}
                    />
                )}
            </div>
        </div>
    );
};

// Enhanced Instance Card Component
const InstanceCard = ({ instance, onAction }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const getStatusColor = (state) => {
        const colors = {
            running: '#10B981',
            stopped: '#EF4444',
            stopping: '#F59E0B',
            starting: '#3B82F6',
            terminated: '#6B7280',
        };
        return colors[state] || '#9CA3AF';
    };

    const handleAction = async (action) => {
        setIsLoading(true);
        await onAction(instance.InstanceId, action);
        setIsLoading(false);
    };

    const isDisabled = (action) => {
        if (isLoading) return true;
        if (['terminated', 'terminating'].includes(instance.State)) return true;

        switch (action) {
            case 'start': return ['running', 'starting'].includes(instance.State);
            case 'stop': return ['stopped', 'stopping'].includes(instance.State);
            default: return false;
        }
    };

    return (
        <article
            style={{
                ...styles.serviceCard,
                ...(isHovered ? styles.serviceCardHover : {})
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #FF9900 0%, #FFAA33 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 20px rgba(255, 153, 0, 0.3)'
                    }}>
                        <Server size={24} color="#0f1419" />
                    </div>
                    <div>
                        <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            color: '#ffffff',
                            marginBottom: '4px'
                        }}>{instance.Name}</h3>
                        <p style={{
                            fontSize: '0.875rem',
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontFamily: '"JetBrains Mono", monospace'
                        }}>{instance.InstanceId}</p>
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(15, 20, 25, 0.8)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 153, 0, 0.2)'
                }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: getStatusColor(instance.State),
                        boxShadow: `0 0 10px ${getStatusColor(instance.State)}`
                    }}></div>
                    <span style={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        textTransform: 'capitalize',
                        color: getStatusColor(instance.State)
                    }}>
                        {instance.State}
                    </span>
                </div>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1.5rem'
            }}>
                {[
                    { label: 'Instance Type', value: instance.InstanceType, icon: <Cpu size={14} /> },
                    { label: 'Platform', value: instance.Platform, icon: <Shield size={14} /> },
                    { label: 'Public IP', value: instance.PublicIpAddress, icon: null },
                    { label: 'Private IP', value: instance.PrivateIpAddress, icon: null }
                ].map((detail, index) => (
                    <div key={index} style={{
                        background: 'rgba(15, 20, 25, 0.5)',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 153, 0, 0.1)'
                    }}>
                        <div style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginBottom: '4px'
                        }}>{detail.label}</div>
                        <div style={{
                            color: '#ffffff',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            fontFamily: '"JetBrains Mono", monospace',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            {detail.icon}
                            {detail.value}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
                {[
                    { action: 'start', icon: <Play size={16} />, color: '#10B981', label: 'Start' },
                    { action: 'stop', icon: <Square size={16} />, color: '#F59E0B', label: 'Stop' },
                    { action: 'terminate', icon: <Trash2 size={16} />, color: '#EF4444', label: 'Terminate' }
                ].map((btn) => (
                    <button
                        key={btn.action}
                        onClick={() => handleAction(btn.action)}
                        disabled={isDisabled(btn.action)}
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '12px 16px',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: isDisabled(btn.action) ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            color: 'white',
                            background: isDisabled(btn.action) ?
                                'rgba(108, 117, 125, 0.3)' :
                                `linear-gradient(135deg, ${btn.color} 0%, ${btn.color}CC 100%)`,
                            opacity: isDisabled(btn.action) ? 0.5 : 1,
                            transition: 'all 0.3s ease',
                            boxShadow: isDisabled(btn.action) ?
                                'none' :
                                `0 4px 15px ${btn.color}40`
                        }}
                    >
                        {btn.icon}
                        {btn.label}
                    </button>
                ))}
            </div>

            {isLoading && (
                <div style={{
                    marginTop: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    color: '#FF9900',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                }}>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Processing request...</span>
                </div>
            )}
        </article>
    );
};

// Enhanced S3 Bucket Card Component
const BucketCard = ({ bucket, onBucketClick, onDeleteBucket }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <article
            style={{
                ...styles.serviceCard,
                ...(isHovered ? styles.serviceCardHover : {})
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem'
            }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        cursor: 'pointer',
                        flex: 1
                    }}
                    onClick={() => onBucketClick(bucket)}
                >
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                    }}>
                        <Database size={24} color="#ffffff" />
                    </div>
                    <div>
                        <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            color: '#ffffff',
                            marginBottom: '4px'
                        }}>{bucket.Name}</h3>
                        <p style={{
                            fontSize: '0.875rem',
                            color: 'rgba(255, 255, 255, 0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            <HardDrive size={12} />
                            S3 Bucket • {bucket.ObjectCount || 0} objects
                        </p>
                    </div>
                </div>
                <div style={styles.itemActions}>
                    <div
                        style={styles.actionIcon}
                        onClick={() => onDeleteBucket(bucket)}
                    >
                        <Trash2 size={16} />
                    </div>
                </div>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem'
            }}>
                <div style={{
                    background: 'rgba(15, 20, 25, 0.5)',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 153, 0, 0.1)'
                }}>
                    <div style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '4px'
                    }}>Region</div>
                    <div style={{
                        color: '#ffffff',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        <Zap size={14} />
                        {bucket.Region}
                    </div>
                </div>
                <div style={{
                    background: 'rgba(15, 20, 25, 0.5)',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 153, 0, 0.1)'
                }}>
                    <div style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '4px'
                    }}>Size</div>
                    <div style={{
                        color: '#ffffff',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        <HardDrive size={14} />
                        {bucket.Size}
                    </div>
                </div>
            </div>

            <div style={{
                background: 'rgba(15, 20, 25, 0.5)',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 153, 0, 0.1)'
            }}>
                <div style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '4px'
                }}>Created</div>
                <div style={{
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    <Clock size={14} />
                    {new Date(bucket.CreationDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            </div>

            <div style={{
                marginTop: '1rem',
                padding: '0.75rem 1rem',
                background: 'rgba(255, 153, 0, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 153, 0, 0.2)',
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center'
            }}>
                Click to browse bucket contents
            </div>
        </article>
    );
};

// Enhanced Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ confirmation, onConfirm, onCancel }) => {
    const getIcon = () => {
        switch (confirmation.type) {
            case 'file': return <File size={24} color="#EF4444" />;
            case 'folder': return <Folder size={24} color="#EF4444" />;
            case 'bucket': return <Database size={24} color="#EF4444" />;
            default: return <AlertCircle size={24} color="#EF4444" />;
        }
    };

    const getWarningMessage = () => {
        switch (confirmation.type) {
            case 'bucket':
                return {
                    title: '⚠️ Permanent Deletion Warning',
                    message: 'Bucket deletion is permanent and cannot be undone. The bucket must be completely empty before deletion.',
                    bgColor: 'rgba(239, 68, 68, 0.1)',
                    borderColor: 'rgba(239, 68, 68, 0.3)'
                };
            case 'folder':
                return {
                    title: '📁 Folder Deletion',
                    message: 'Only empty folders can be deleted. Make sure all files and subfolders are removed first.',
                    bgColor: 'rgba(245, 158, 11, 0.1)',
                    borderColor: 'rgba(245, 158, 11, 0.3)'
                };
            default:
                return null;
        }
    };

    const warning = getWarningMessage();

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <header style={styles.modalHeader}>
                    {getIcon()}
                    <h3 style={styles.modalTitle}>{confirmation.title}</h3>
                    <div
                        style={styles.modalClose}
                        onClick={onCancel}
                    >
                        <X size={20} />
                    </div>
                </header>

                <div style={styles.modalBody}>
                    <p style={styles.modalText}>{confirmation.message}</p>

                    <div style={{
                        background: 'rgba(15, 20, 25, 0.8)',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginTop: '1rem',
                        border: '1px solid rgba(255, 153, 0, 0.2)'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '0.5rem'
                        }}>
                            <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Name:</span>
                            <span style={styles.modalHighlight}>{confirmation.item.Name}</span>
                        </div>

                        {confirmation.item.Size && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '0.5rem'
                            }}>
                                <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Size:</span>
                                <span style={{ color: '#ffffff' }}>{confirmation.item.Size}</span>
                            </div>
                        )}

                        {confirmation.type === 'folder' && confirmation.item.FileCount !== undefined && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '0.5rem'
                            }}>
                                <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Items:</span>
                                <span style={{ color: '#ffffff' }}>{confirmation.item.FileCount}</span>
                            </div>
                        )}

                        {confirmation.item.LastModified && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}>
                                <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Modified:</span>
                                <span style={{ color: '#ffffff' }}>
                                    {new Date(confirmation.item.LastModified).toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>

                    {warning && (
                        <div style={{
                            padding: '1rem',
                            background: warning.bgColor,
                            borderRadius: '8px',
                            border: `1px solid ${warning.borderColor}`,
                            marginTop: '1rem'
                        }}>
                             <p style={{
                                 color: '#EF4444',
                                 fontSize: '0.875rem',
                                 margin: 0
                             }}>
                                 {warning.message}
                            </p>
                        </div>
                    )}
                </div>

                <footer style={styles.modalActions}>
                    <button
                        style={{
                            ...styles.modalButton,
                            ...styles.modalButtonCancel
                        }}
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        style={{
                            ...styles.modalButton,
                            ...styles.modalButtonDelete
                        }}
                        onClick={onConfirm}
                    >
                        Delete {confirmation.type.charAt(0).toUpperCase() + confirmation.type.slice(1)}
                    </button>
                </footer>
            </div>
        </div>
    );
};


export default AWSManager;
