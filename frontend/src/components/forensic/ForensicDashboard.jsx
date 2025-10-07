import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Statistic, Table, Button, Space, Tag, Modal, message,
  Tooltip, Badge, Popconfirm, Timeline, Descriptions, Divider
} from 'antd';
import {
  FileProtectOutlined, DownloadOutlined, DeleteOutlined,
  SafetyCertificateOutlined, ClockCircleOutlined, UserOutlined,
  CheckCircleOutlined, EyeOutlined, FolderOpenOutlined
} from '@ant-design/icons';
import forensicService from '../../services/forensicService';
import './ForensicDashboard.css';

const ForensicDashboard = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [stats, setStats] = useState({ total: 0, today: 0, archived: 0 });

  useEffect(() => {
    loadProfiles();
    const interval = setInterval(loadProfiles, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const data = await forensicService.getProfiles();
      setProfiles(data.profiles);
      
      const today = new Date().toDateString();
      const todayCount = data.profiles.filter(
        p => new Date(p.createdAt).toDateString() === today
      ).length;

      setStats({ total: data.total, today: todayCount, archived: 0 });
    } catch (error) {
      message.error('Erreur lors du chargement des profils');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async (sessionId) => {
    try {
      await forensicService.downloadReport(sessionId);
      message.success('Rapport forensique téléchargé');
    } catch (error) {
      message.error('Erreur lors du téléchargement');
    }
  };

  const handleViewReport = async (profile) => {
    try {
      const report = await forensicService.getReport(profile.sessionId);
      setReportData(report);
      setSelectedProfile(profile);
      setReportModalVisible(true);
    } catch (error) {
      message.error('Erreur lors de la récupération du rapport');
    }
  };

  const handleArchive = async (sessionId) => {
    try {
      const result = await forensicService.archiveProfile(sessionId);
      message.success(`Profil archivé: ${result.archivePath}`, 5);
      loadProfiles();
    } catch (error) {
      message.error("Erreur lors de l'archivage");
    }
  };

  const handleCleanup = async () => {
    try {
      const result = await forensicService.cleanupExpired(90);
      message.success(`${result.deleted_profiles} profils nettoyés (rétention: 90 jours)`);
      loadProfiles();
    } catch (error) {
      message.error('Erreur lors du nettoyage');
    }
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const columns = [
    {
      title: 'Session ID',
      dataIndex: 'sessionId',
      key: 'sessionId',
      width: 120,
      render: (text) => (
        <Tooltip title={text}>
          <code style={{ fontSize: '0.85em', color: '#1890ff', cursor: 'pointer' }}>
            {text.substring(0, 8)}...
          </code>
        </Tooltip>
      )
    },
    {
      title: 'Target',
      dataIndex: 'targetId',
      key: 'targetId',
      render: (text) => <Tag icon={<UserOutlined />} color="blue">{text}</Tag>
    },
    {
      title: 'Operator',
      dataIndex: 'operator',
      key: 'operator',
      render: (text) => <Badge status="processing" text={text || 'system'} />
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => (
        <Tooltip title={new Date(text).toLocaleString()}>
          <span style={{ fontSize: '0.9em' }}>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {formatRelativeTime(text)}
          </span>
        </Tooltip>
      )
    },
    {
      title: 'Status',
      key: 'status',
      render: () => <Tag icon={<CheckCircleOutlined />} color="success">Active</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 250,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Voir le rapport">
            <Button icon={<EyeOutlined />} size="small" onClick={() => handleViewReport(record)} />
          </Tooltip>
          <Tooltip title="Télécharger rapport">
            <Button icon={<DownloadOutlined />} size="small" type="primary" 
              onClick={() => handleDownloadReport(record.sessionId)} />
          </Tooltip>
          <Tooltip title="Archiver">
            <Button icon={<FolderOpenOutlined />} size="small" 
              onClick={() => handleArchive(record.sessionId)} />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className="forensic-dashboard">
      <div className="dashboard-header">
        <h1>
          <SafetyCertificateOutlined style={{ marginRight: 12 }} />
          Forensic Profile Management
        </h1>
        <Tag color="green">ISO/IEC 27037:2012 Compliant</Tag>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="Total Profiles" value={stats.total} 
              prefix={<FileProtectOutlined />} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Created Today" value={stats.today} 
              prefix={<ClockCircleOutlined />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Archived" value={stats.archived} 
              prefix={<FolderOpenOutlined />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Popconfirm title="Nettoyer les profils expirés ?" 
              description="Profils > 90 jours seront archivés" onConfirm={handleCleanup}>
              <Button type="primary" danger icon={<DeleteOutlined />} block size="large">
                Cleanup Expired
              </Button>
            </Popconfirm>
          </Card>
        </Col>
      </Row>

      <Card title="Active Forensic Profiles" 
        extra={<Button icon={<SafetyCertificateOutlined />} onClick={loadProfiles} loading={loading}>Refresh</Button>}>
        <Table columns={columns} dataSource={profiles} loading={loading} rowKey="sessionId"
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total: ${total} profiles` }} />
      </Card>

      <Modal title={<span><FileProtectOutlined style={{ marginRight: 8 }} />Forensic Report - {selectedProfile?.targetId}</span>}
        open={reportModalVisible} onCancel={() => setReportModalVisible(false)} width={800}
        footer={[
          <Button key="download" type="primary" icon={<DownloadOutlined />} 
            onClick={() => handleDownloadReport(selectedProfile?.sessionId)}>Download JSON</Button>,
          <Button key="close" onClick={() => setReportModalVisible(false)}>Close</Button>
        ]}>
        {reportData && (
          <>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Report Type">{reportData.report_type}</Descriptions.Item>
              <Descriptions.Item label="Version">{reportData.report_version}</Descriptions.Item>
              <Descriptions.Item label="Generated At">{new Date(reportData.generated_at).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Session ID"><code>{reportData.session?.id}</code></Descriptions.Item>
              <Descriptions.Item label="Target">{reportData.session?.target_id}</Descriptions.Item>
              <Descriptions.Item label="Operator">{reportData.session?.operator}</Descriptions.Item>
            </Descriptions>

            <Divider>Compliance</Divider>
            <Space>
              {reportData.compliance?.map((comp) => (
                <Tag key={comp} color="green" icon={<SafetyCertificateOutlined />}>{comp}</Tag>
              ))}
            </Space>

            <Divider>Chain of Custody</Divider>
            <Timeline items={reportData.chain_of_custody?.slice(0, 5).map((event) => ({
              color: 'blue',
              children: (
                <div>
                  <strong>{event.event}</strong><br />
                  <small>{new Date(event.timestamp).toLocaleString()}</small>
                </div>
              )
            }))} />

            <Divider>Integrity</Divider>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Hash">
                <code style={{ fontSize: '0.8em' }}>{reportData.integrity?.profile_hash}</code>
              </Descriptions.Item>
              <Descriptions.Item label="Algorithm">{reportData.integrity?.algorithm?.toUpperCase()}</Descriptions.Item>
              <Descriptions.Item label="Verified At">{new Date(reportData.integrity?.verified_at).toLocaleString()}</Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ForensicDashboard;