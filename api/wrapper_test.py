import time
import numpy as np

if __name__ == '__main__':

    arr=np.random.rand(10,10)
    np.savetxt('arr.txt', arr)

    print(arr)
    
    #this should be caught from stdout
    for i in range(60):
        time.sleep(1)
        print(i)
    

