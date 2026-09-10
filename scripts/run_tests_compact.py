import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
for item in (ROOT, ROOT / 'server', ROOT / 'vendor', ROOT / 'tests'):
    value = str(item)
    if value not in sys.path:
        sys.path.insert(0, value)

MODULES = (
    'tests.test_server',
    'tests.test_watch',
    'tests.test_manual_watch',
    'tests.test_pdf_watch',
    'tests.test_convocations',
    'tests.test_lan_server',
)

class CompactResult(unittest.TextTestResult):
    def startTestRun(self):
        super().startTestRun()
        self.total = getattr(self, 'expected_total', 0)
        self.current = 0
        self.stream.write('Statut tests : 0 / %s' % self.total)
        self.stream.flush()

    def startTest(self, test):
        super().startTest(test)
        self.current += 1
        self.stream.write('\rStatut tests : %s / %s' % (self.current, self.total))
        self.stream.flush()

    def addError(self, test, err):
        super().addError(test, err)
        self.stream.write('\nERREUR : %s\n' % self.getDescription(test))

    def addFailure(self, test, err):
        super().addFailure(test, err)
        self.stream.write('\nECHEC : %s\n' % self.getDescription(test))

    def stopTestRun(self):
        self.stream.write('\n')
        super().stopTestRun()

class CompactRunner(unittest.TextTestRunner):
    resultclass = CompactResult

    def _makeResult(self):
        result = super()._makeResult()
        result.expected_total = self.expected_total
        return result

    def run(self, test):
        self.expected_total = test.countTestCases()
        return super().run(test)

def main():
    loader = unittest.defaultTestLoader
    suite = unittest.TestSuite(loader.loadTestsFromName(name) for name in MODULES)
    result = CompactRunner(verbosity=0).run(suite)
    return 0 if result.wasSuccessful() else 1

if __name__ == '__main__':
    raise SystemExit(main())