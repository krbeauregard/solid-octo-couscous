import pprint
import scipy
import scipy.linalg

A = scipy.array([[1,2,4],[3,8,14],[2,6,13]])
P,L,U = scipy.linalg.lu(A)

print('A:')
pprint.pprint(A)
print('P:')
pprint.pprint(P)
print('L:')
pprint.pprint(L)
print('U:')
pprint.pprint(U)
