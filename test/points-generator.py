'''
Funcion que genera puntos dentro de los limites X & Y
Genera 
'''
def f(limitex, limitey, iniciox=0, inicioy=0, pixeles = 32):
    i = iniciox
    j = inicioy
    aux = True
    while j <= limitey:
        if aux:
            i = iniciox
        else:
            i = pixeles // 2 + iniciox
        aux = not aux
            
        while i <= limitex:
            print("[%s , %s]," % (i,j) )
            i += pixeles

        j+= pixeles

def get_inter_points(x, pixeles = 32):
    i = 0
    while i < x:
        print(i, end=", ")
        i += pixeles
    print(x)



f(800,608,32,32, 96)