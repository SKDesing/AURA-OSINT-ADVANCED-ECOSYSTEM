#!/usr/bin/env node
const EngineBase = require('../../core/engine-base/EngineBase');

class TestEngine extends EngineBase {
    async setupDatabase() { 
        this.db = { end: async () => {} }; 
    }
    
    async setupStorage() { 
        this.storage = {}; 
    }
    
    async setupConnections() { 
        // Mock connection setup
    }
    
    async createSession(target, sessionId) { 
        return { 
            id: sessionId, 
            targetId: target.id, 
            startTime: Date.now(), 
            status: 'created',
            dataCount: 0
        }; 
    }
    
    async connectToTarget() { 
        // Mock connection - can be slow for timeout tests
        if (this.config.simulateSlowConnection) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    async startDataStream() { 
        // Mock data stream start
    }
    
    async disconnectFromTarget() { 
        // Mock disconnection
    }
    
    async finalizeSession() { 
        // Mock session finalization
    }
}

async function testEngineBase() {
    console.log('🧪 Testing EngineBase...\n');

    try {
        // Test 1: Initialization
        console.log('📋 Test 1: Engine initialization...');
        const engine = new TestEngine('test', { connectionTimeout: 1000 });
        await engine.initialize();
        
        if (engine.status === 'ready') {
            console.log('✅ Engine initialized successfully');
        } else {
            console.log('❌ Engine initialization failed');
        }

        // Test 2: Target validation
        console.log('\n📋 Test 2: Target validation...');
        try {
            await engine.addTarget({ username: 'testuser' });
            console.log('✅ Valid target added successfully');
        } catch (error) {
            console.log('❌ Valid target rejected:', error.message);
        }

        try {
            await engine.addTarget({ invalid: 'data' });
            console.log('❌ Invalid target accepted (should fail)');
        } catch (error) {
            console.log('✅ Invalid target properly rejected:', error.message);
        }

        // Test 3: Duplicate target prevention
        console.log('\n📋 Test 3: Duplicate target prevention...');
        try {
            await engine.addTarget({ username: 'testuser' });
            console.log('❌ Duplicate target accepted (should fail)');
        } catch (error) {
            console.log('✅ Duplicate target properly rejected:', error.message);
        }

        // Test 4: Data sanitization
        console.log('\n📋 Test 4: Data sanitization...');
        const sensitiveData = {
            username: 'test',
            password: 'secret123',
            token: 'abc123',
            apiKey: 'key123'
        };
        
        const sanitized = engine.sanitizeTargetData(sensitiveData);
        
        if (sanitized.username === 'test' && 
            !sanitized.password && 
            !sanitized.token && 
            !sanitized.apiKey) {
            console.log('✅ Data sanitization working correctly');
        } else {
            console.log('❌ Data sanitization failed');
        }

        // Test 5: Unique ID generation
        console.log('\n📋 Test 5: Unique ID generation...');
        const id1 = engine.generateTargetId({ username: 'user1' });
        const id2 = engine.generateTargetId({ username: 'user1' });
        
        if (id1 !== id2) {
            console.log('✅ Unique IDs generated correctly');
            console.log(`   ID1: ${id1}`);
            console.log(`   ID2: ${id2}`);
        } else {
            console.log('❌ ID collision detected:', id1);
        }

        // Test 6: Session management
        console.log('\n📋 Test 6: Session management...');
        const targetId = await engine.addTarget({ username: 'sessiontest' });
        const sessionId = await engine.startCollection(targetId);
        
        if (engine.sessions.has(sessionId)) {
            console.log('✅ Session created successfully:', sessionId);
            
            await engine.stopCollection(sessionId);
            
            if (!engine.sessions.has(sessionId)) {
                console.log('✅ Session stopped and cleaned up');
            } else {
                console.log('❌ Session not properly cleaned up');
            }
        } else {
            console.log('❌ Session creation failed');
        }

        // Test 7: Connection timeout
        console.log('\n📋 Test 7: Connection timeout...');
        const slowEngine = new TestEngine('slow', { 
            connectionTimeout: 500,
            simulateSlowConnection: true 
        });
        await slowEngine.initialize();

        const slowTargetId = await slowEngine.addTarget({ username: 'slowtest' });
        
        try {
            await slowEngine.startCollection(slowTargetId);
            console.log('❌ Timeout not triggered (should have failed)');
        } catch (error) {
            if (error.message.includes('timeout')) {
                console.log('✅ Connection timeout working correctly');
            } else {
                console.log('❌ Unexpected error:', error.message);
            }
        }

        await slowEngine.shutdown();

        // Test 8: Status reporting
        console.log('\n📋 Test 8: Status reporting...');
        const status = engine.getStatus();
        
        if (status.platform === 'test' && 
            status.targets > 0 && 
            status.uptime > 0) {
            console.log('✅ Status reporting working correctly');
            console.log(`   Platform: ${status.platform}`);
            console.log(`   Targets: ${status.targets}`);
            console.log(`   Uptime: ${status.uptime}ms`);
        } else {
            console.log('❌ Status reporting failed');
        }

        // Test 9: Shutdown cleanup
        console.log('\n📋 Test 9: Shutdown cleanup...');
        await engine.shutdown();
        
        if (engine.status === 'stopped' && engine.sessions.size === 0) {
            console.log('✅ Shutdown cleanup successful');
        } else {
            console.log('❌ Shutdown cleanup failed');
        }

        console.log('\n🎉 All EngineBase tests completed successfully!');
        
    } catch (error) {
        console.error('❌ Test suite failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

if (require.main === module) {
    testEngineBase();
}

module.exports = testEngineBase;