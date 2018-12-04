if (!window._proxy) {
    window._proxy = {
        getInterceptor: function (object, propertyName) {
            if (object.attr && object._data && object._data[propertyName]) {
                return object.attr(propertyName);
            }
            return object[propertyName];
        },
        setInterceptor: function (object, propertyName, value) {
            if (object.attr) {
                return object.attr(propertyName, value);
            }
            else {
                return object[propertyName] = value;
            }
        },
        updatePostfixAddInterceptor: function (object, propertyName) {
            var original = this.getInterceptor(object, propertyName)
            this.setInterceptor(object, propertyName, original + 1)
            return original;
        },
        updatePostfixSubtractInterceptor: function (object, propertyName, value) {
            var original = this.getInterceptor(object, propertyName);
            this.setInterceptor(object, propertyName, value - 1);
            return original;
        }
    };
}