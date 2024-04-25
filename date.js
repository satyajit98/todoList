//jshint esversion:6

exports.getDate = function(){

    const option = {
        weekday: 'long',
        day: 'numeric',
        year: 'numeric',
        month: 'long'
    };

    const today = new Date();
    return today.toLocaleDateString("en-US", option);
};

exports.getDay = function(){

    const option = {
        weekday: 'long'
    };

    const today = new Date();
    return today.toLocaleDateString("en-US", option);
};