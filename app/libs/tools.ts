import { Key } from "react";

class Tools {
    public static ArrayEqual(a:Key[], b:Key[]) {
        //先将数组排序
        a = a.sort();
        b = b.sort();
        //判断数组长度是否相等，若不相等返回false
        if (a.length != b.length) 
        return false;
        //逐个比较数组元素
        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) 
            return false;
        }
        return true;
    }
}

export default Tools;