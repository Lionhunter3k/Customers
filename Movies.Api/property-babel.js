var fs = require('fs')
var babylon = require('babylon')

module.exports = function (babel) {

    var t = babel.types;

    function attachRuntime(programPath) {
        // get and parse runtime - i think that there should be better ways to do this...
        // addHelper is internal thing that's why i didn't use it
        var runtimeSourceCode = fs.readFileSync(require.resolve('./runtime')).toString()
        var runtimeAst = babylon.parse(runtimeSourceCode)

        programPath.unshiftContainer('body', runtimeAst.program.body)
    }

    function attrMethod(name) {
        var expr = t.memberExpression(t.identifier('_proxy'), t.identifier(name));
        expr.isClean = true;
        return expr;
    }

    var proxyNodes = {
        UpdateExpression(path) {
            if (path.parentPath.isCallExpression({ callee: path.node })) return;
            if (t.isMemberExpression(path.node.argument)) {
                var memberExpr = path.node.argument
                if (path.node.prefix) {
                    var callee = memberExpr.computed ? memberExpr.property : t.stringLiteral(memberExpr.property.name)
                    var gotten = t.callExpression(attrMethod('getInterceptor'), [memberExpr.object, callee])
                    var newVal = t.binaryExpression(path.node.operator.substr(0, 1), gotten, t.numericLiteral(1))
                    path.replaceWith(
                        t.callExpression(attrMethod('setInterceptor'), [
                            memberExpr.object,
                            callee,
                            newVal
                        ])
                    )
                } else {
                    var fun = 'updatePostfix' +
                        (path.node.operator === '++' ? 'Add' : 'Subtract') + 'Interceptor';
                    var callee = memberExpr.computed ? memberExpr.property : t.stringLiteral(memberExpr.property.name)
                    var callExp = t.callExpression(attrMethod(fun), [
                        memberExpr.object,
                        callee
                    ]);
                    path.replaceWith(callExp);
                    //var blkSt = t.blockStatement([t.returnStatement(callExp)])
                    //var funExp = t.functionExpression(null, [], blkSt, false, false)
                    //var expst = t.expressionStatement(t.callExpression(funExp, []))
                    //path.replaceWith(expst)
                }
            }
        },
        AssignmentExpression: function (path) {
            var lhs = path.node.left;
            var rhs = path.node.right;

            if (t.isMemberExpression(lhs)) {
                if (t.isIdentifier(lhs.property)) {
                    lhs.property = t.stringLiteral(lhs.property.name);
                }

                path.replaceWith(
                    t.callExpression(
                        attrMethod('setInterceptor'),
                        [lhs.object, lhs.property, rhs]
                    )
                );
            }
        },
        MemberExpression: function (path) {
            if (path.parentPath.isCallExpression({ callee: path.node })) return;
            if (path.node.isClean) return;
            if (t.isAssignmentExpression(path.parent)) return;
            if (path.node.object.name == 'console' ||
                path.node.object.name == 'window' ||
                path.node.object.name == 'global') return;

            if (t.isIdentifier(path.node.property)) {
                path.node.property = t.stringLiteral(path.node.property.name);
            }

            path.replaceWith(
                t.callExpression(
                    attrMethod('getInterceptor'),
                    [path.node.object, path.node.property]
                )
            );
        }
    }

    return {
        visitor: {
            Program: function (path) {
                path.traverse(proxyNodes);
                attachRuntime(path)
            },

        }
    };
};
