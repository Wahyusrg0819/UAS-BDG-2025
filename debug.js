// Performance monitoring and debugging utilities
// Include this file for development mode only

(function() {
    'use strict';

    // Performance monitoring
    const PerformanceMonitor = {
        timers: {},
        
        start: function(label) {
            this.timers[label] = performance.now();
            console.log(`⏱️ Started: ${label}`);
        },
        
        end: function(label) {
            if (this.timers[label]) {
                const duration = performance.now() - this.timers[label];
                console.log(`✅ Completed: ${label} - ${duration.toFixed(2)}ms`);
                delete this.timers[label];
                return duration;
            }
            return 0;
        },
        
        mark: function(label) {
            console.log(`📍 Checkpoint: ${label} - ${performance.now().toFixed(2)}ms`);
        }
    };

    // Memory usage monitor
    const MemoryMonitor = {
        logUsage: function(label = '') {
            if (performance.memory) {
                const used = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
                const total = (performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2);
                const limit = (performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2);
                
                console.log(`🧠 Memory ${label}: ${used}MB / ${total}MB (limit: ${limit}MB)`);
            }
        },
        
        checkLeaks: function() {
            this.logUsage('Check');
            
            if (performance.memory && performance.memory.usedJSHeapSize > 50 * 1024 * 1024) {
                console.warn('⚠️ High memory usage detected (>50MB)');
            }
        }
    };

    // Network monitoring
    const NetworkMonitor = {
        logConnectionInfo: function() {
            if (navigator.connection) {
                const conn = navigator.connection;
                console.log(`🌐 Network: ${conn.effectiveType} (${conn.downlink}Mbps, RTT: ${conn.rtt}ms)`);
                
                if (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
                    console.warn('⚠️ Slow network detected - consider reducing data transfer');
                }
            }
        }
    };

    // Database query monitor
    const QueryMonitor = {
        queries: [],
        
        logQuery: function(query, duration, resultCount) {
            const queryInfo = {
                query: query,
                duration: duration,
                resultCount: resultCount,
                timestamp: new Date().toISOString()
            };
            
            this.queries.push(queryInfo);
            
            if (duration > 5000) { // Slow query threshold: 5 seconds
                console.warn(`🐌 Slow query detected: ${duration}ms`, query);
            } else {
                console.log(`🔍 Query executed: ${duration}ms (${resultCount} results)`);
            }
        },
        
        getStats: function() {
            if (this.queries.length === 0) return null;
            
            const durations = this.queries.map(q => q.duration);
            const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
            const maxDuration = Math.max(...durations);
            const totalQueries = this.queries.length;
            
            return {
                totalQueries,
                avgDuration: avgDuration.toFixed(2),
                maxDuration: maxDuration.toFixed(2),
                slowQueries: this.queries.filter(q => q.duration > 5000).length
            };
        }
    };

    // Connection diagnostic
    const ConnectionDiagnostic = {
        testConnection: async function(config) {
            console.log('🔧 Running connection diagnostics...');
            
            const diagnostics = {
                dnsResolution: false,
                tcpConnection: false,
                sslHandshake: false,
                authentication: false,
                queryExecution: false,
                totalTime: 0
            };
            
            const startTime = performance.now();
            
            try {
                // Test basic connectivity
                console.log('1️⃣ Testing DNS resolution...');
                const url = new URL(config.neo4j.uri.replace('neo4j+s://', 'https://'));
                await fetch(`https://${url.hostname}`, { mode: 'no-cors' });
                diagnostics.dnsResolution = true;
                console.log('✅ DNS resolution successful');
                
                // Test Neo4j connection
                console.log('2️⃣ Testing Neo4j connection...');
                const driver = neo4j.driver(
                    config.neo4j.uri,
                    neo4j.auth.basic(config.neo4j.username, config.neo4j.password)
                );
                
                await driver.verifyConnectivity();
                diagnostics.tcpConnection = true;
                diagnostics.sslHandshake = true;
                diagnostics.authentication = true;
                console.log('✅ Neo4j connection successful');
                
                // Test query execution
                console.log('3️⃣ Testing query execution...');
                const session = driver.session();
                const result = await session.run('RETURN 1 as test');
                diagnostics.queryExecution = true;
                console.log('✅ Query execution successful');
                
                await session.close();
                await driver.close();
                
            } catch (error) {
                console.error('❌ Connection diagnostic failed:', error);
                
                if (error.message.includes('DNS')) {
                    console.error('DNS resolution failed - check network connectivity');
                } else if (error.message.includes('authentication')) {
                    console.error('Authentication failed - check credentials');
                } else if (error.message.includes('timeout')) {
                    console.error('Connection timeout - check firewall settings');
                }
            }
            
            diagnostics.totalTime = performance.now() - startTime;
            console.log('🏁 Connection diagnostics completed:', diagnostics);
            
            return diagnostics;
        }
    };

    // Export utilities to global scope for debugging
    window.PerformanceMonitor = PerformanceMonitor;
    window.MemoryMonitor = MemoryMonitor;
    window.NetworkMonitor = NetworkMonitor;
    window.QueryMonitor = QueryMonitor;
    window.ConnectionDiagnostic = ConnectionDiagnostic;

    // Auto-start monitoring
    console.log('🔍 Performance monitoring enabled');
    NetworkMonitor.logConnectionInfo();
    MemoryMonitor.logUsage('Initial');

    // Monitor memory every 30 seconds
    setInterval(() => {
        MemoryMonitor.checkLeaks();
    }, 30000);

})();
