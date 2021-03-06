
var tests = (function () {
    // test loca
    var locatest = {
        setup: function () {
            // craete a dict
            var dict = {
                txt_test1 : ['test1_1', 'test1_2'],
                txt_test2 : ['test2_1', 'test2_2'],
                txt_test3 : ['test3_1', 'test3_2'],
                txt_test4 : ['#var# test', '#var# test2', { containsVariables: true}],
                txt_text5: ['#var# test #var#', '#var# test2 #var#', { containsVariables: true}],
                txt_text6: ['#var# test #var2#', '#var# test2 #var2#', { containsVariables: true}],
                txt_text7: ['#var# test #var2#', '#var# test2 #var2#']
            };
            // create the spans
            $('#testresults').append('<div id="test_remove_me">'
                    + '<span id="txt_test1"></span>'
                    + '<p><span id="txt_test2"></span></p>'
                    + '<p><div><span id="txt_test3"></span></div></p>'
                    + '<p><div><span id="txt_test4"></span></div></p>'
                    + '<div><p><div><span id="txt_test1"></span></div></p></div>'
                    + '<input type="button" id="btn_1" value="txt_test1" >'
                    + '<input type="button" id="btn_2" value="txt_test2" >'
                    + '<input type="button" id="btn_3" value="txt_text5" >'
                    + '</div>'
                    );

            // init the loca
            loca.setDict(dict);
        },

        tearDown: function () {
            loca.setDict(null);
            loca.setButtonDict(null);
            // remove the test elements
            $('#test_remove_me').remove();
        },

        _testLoca : function () {
            locatest.setup();
            impunit.assertEqual('test1_1', loca.getLocaData('txt_test1'));
            impunit.assertEqual('test1_1', loca.getLocaData('txt_test1', 0));
            impunit.assertEqual('test1_2', loca.getLocaData('txt_test1', 1));
            locatest.tearDown();
        },

        _testLocaReplace: function () {
            locatest.setup();
            loca.applyLocalization(0);
            impunit.assertEqual('test1_1', $('#txt_test1').html());
            impunit.assertEqual('test2_1', $('#txt_test2').html());
            impunit.assertEqual('test3_1', $('#txt_test3').html());
            locatest.tearDown();
        },

        _testLocaChange: function () {
            locatest.setup();
            loca.applyLocalization(0);
            loca.applyLocalization(1);
            impunit.assertEqual('test1_2', $('#txt_test1').html());
            impunit.assertEqual('test2_2', $('#txt_test2').html());
            impunit.assertEqual('test3_2', $('#txt_test3').html());
            locatest.tearDown();
        },

        _testLocaButtons: function () {
            locatest.setup();
            loca.applyLocalization(0);
            impunit.assertEqual('test1_1', $('#btn_1').val(), "Button 1 was not localized correctly");
            impunit.assertEqual('test2_1', $('#btn_2').val(), "Button 2 was not localized correctly");
            locatest.tearDown();
        },

        _testLocaButtonChange: function () {
            locatest.setup();
            loca.applyLocalization(0);
            loca.applyLocalization(1);
            impunit.assertEqual('test1_2', $('#btn_1').val(), "Button 1 was not localized correctly");
            impunit.assertEqual('test2_2', $('#btn_2').val(), "Button 2 was not localized correctly");
            locatest.tearDown();
        },

        _testLocaProcessed: function () {
            locatest.setup();
            var processedText;
            loca.setVariable('#var#', 66);
            processedText = loca.getProcessedLocaData("txt_test4", 0);
            impunit.assertEqual("66 test", processedText);

            loca.setVariable('#var#', "my");
            processedText = loca.getProcessedLocaData("txt_test4", 1);
            impunit.assertEqual("my test2", processedText);
            locatest.tearDown();
        },

        _testLocaProcessedMultiSameVar: function () {
            locatest.setup();
            var processedText;
            loca.setVariable('#var#', 66);
            processedText = loca.getProcessedLocaData("txt_text5", 0);
            impunit.assertEqual("66 test 66", processedText);

            loca.setVariable('#var#', "my");
            processedText = loca.getProcessedLocaData("txt_text5", 1);
            impunit.assertEqual("my test2 my", processedText)
            locatest.tearDown();
        },

        _testLocaProcessedMultiDiffVar: function () {
            locatest.setup();
            var processedText;
            loca.setVariable('#var#', 66);
            loca.setVariable('#var2#', 'wood');
            processedText = loca.getProcessedLocaData("txt_text6", 0);
            impunit.assertEqual("66 test wood", processedText);

            loca.setVariable('#var#', "my");
            loca.setVariable('#var2#', "88");
            processedText = loca.getProcessedLocaData("txt_text6", 1);
            impunit.assertEqual("my test2 88", processedText)
            locatest.tearDown();
        },

        _testLocaProcessedMultiDiffVarDisabled: function () {
            locatest.setup();
            var processedText;
            loca.setVariable('#var#', 66);
            loca.setVariable('#var2#', 'wood');
            processedText = loca.getProcessedLocaData("txt_text7", 0);
            impunit.assertEqual("#var# test #var2#", processedText);

            loca.setVariable('#var#', "my");
            loca.setVariable('#var2#', "88");
            processedText = loca.getProcessedLocaData("txt_text7", 1);
            impunit.assertEqual("#var# test2 #var2#", processedText)
            locatest.tearDown();
        },

        _testLocaProcessedButton: function () {
            locatest.setup();
            loca.applyLocalization(0);
            var processedText;
            loca.setVariable('#var#', 66);
            loca.updateVariables('btn_3', 0);
            impunit.assertEqual('66 test 66', $('#btn_3').val(), "Button 3 was not localized correctly");

            loca.updateVariables('btn_3', 1);
            impunit.assertEqual('66 test2 66', $('#btn_3').val(), "Button 3 was not localized correctly");
            locatest.tearDown();
        },

        _testLocaProcessedSpan: function () {
            locatest.setup();
            var processedText;
            loca.applyLocalization(0);
            loca.setVariable('#var#', 66);
            loca.updateVariables('txt_test4', 0);
            impunit.assertEqual('66 test', $('#txt_test4').html());

            loca.updateVariables('txt_test4', 1);
            impunit.assertEqual('66 test2', $('#txt_test4').html());
            locatest.tearDown();
        },

        _testLocaGetCurrentLanguage: function () {
            locatest.setup();
            loca.applyLocalization(0);
            impunit.assertEqual(0, loca.getLanguage());
            loca.applyLocalization(1);
            impunit.assertEqual(1, loca.getLanguage());
            locatest.tearDown();
        },

        _testLocaSetGetVariable : function () {
            locatest.setup();
            loca.applyLocalization(0);
            loca.setVariable('#var#', 66)
            impunit.assertEqual(66, loca.getVariable('#var#'));

            loca.setVariable('#var2#', 'peace');
            impunit.assertEqual('peace', loca.getVariable('#var2#'));

            loca.setVariable('#var#', true);
            impunit.assertEqual(true, loca.getVariable('#var#'));

            locatest.tearDown();
        },

        _testLocaUpdateVariables: function () {
            locatest.setup();
            var processedText;
            loca.applyLocalization(0);
            loca.setVariable('#var#', 'sweet');
            loca.updateVariables();

            impunit.assertEqual('sweet test', $('#txt_test4').html());
            loca.applyLocalization(1);
            loca.setVariable('#var#', 'nice')
            loca.updateVariables();
            
            impunit.assertEqual('nice test2', $('#txt_test4').html());
            locatest.tearDown();
        }
    };

    return {
        runTests: function () {
            var tests = [locatest];
            var testRun = 0, testsFailed = 0, messages = "";

            for (var i = 0; i < tests.length; i++) {
                impunit.runTests(tests[i]);
                testRun += impunit.testsRun();
                testsFailed += impunit.testsFailed();
                messages += impunit.messages();
            }

            if (testRun > 0 && testsFailed == 0) {
                $('#testresults').append('<br>impunit: Automatic localization tests successful.<br>'
                    + '<pre>' + messages + ' </pre>'
                    + testRun + ' tests have been executed.');
                $('#testresults').css('color', '#080');

            }
            else {
                $('#testresults').html('TESTS: FAILED'
                        + '<br>tests run: ' + testRun
                        + '<br>tests failed: ' + testsFailed
                        + '<br>messages <pre>: ' + messages
                        + '</pre>');
            }
        }
    }
}());
