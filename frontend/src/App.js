import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  SafetyCertificateOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import ForensicDashboard from './components/forensic/ForensicDashboard';
import './App.css';

const { Header, Sider, Content } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={250} theme="dark">
          <div className="logo" style={{ 
            padding: '16px', 
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            AURA OSINT
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['2']}>
            <Menu.Item key="1" icon={<DashboardOutlined />}>
              <Link to="/">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<SafetyCertificateOutlined />}>
              <Link to="/forensic">Forensic Profiles</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<BarChartOutlined />}>
              <Link to="/analytics">Analytics</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        
        <Layout>
          <Header style={{ background: '#fff', padding: '0 24px' }}>
            <h2 style={{ margin: 0 }}>AURA OSINT - Investigation Platform</h2>
          </Header>
          
          <Content>
            <Routes>
              <Route path="/" element={<div style={{padding: '24px'}}>Dashboard Principal</div>} />
              <Route path="/forensic" element={<ForensicDashboard />} />
              <Route path="/analytics" element={<div style={{padding: '24px'}}>Analytics</div>} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;