/**
 * Created by Nuno on 01/09/17.
 */

'use strict';

nmm.utils = {
    shuffleArray:function(array){
        //Fisher-Yates Shuffle
        //numero de elementos a trocar
        var length = array.length,
            temp,
            index;

        while (length > 0) {
            //escolher um index ao acaso
            index = Math.floor(Math.random() * length);

            //diminuir o numero de elementos a trocar
            length--;

            //pode ser length porque length foi diminuida previamente
            temp = array[length];
            array[length] = array[index];
            array[index] = temp;
        }
        return array;
    }
};