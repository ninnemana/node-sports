$(document).ready(function () {

    $('.itemList:first').fadeIn();
    $('.itemList:first').addClass('active');

    $('.subCatLink,.subCatLabel').click(function () {
        var subID = $(this).attr('id');
        var linkTitle = $(this).text();
        var currentList = $('.itemList .active');

        $('.itemList,.active').fadeOut();
        $('.itemList').removeClass('active');
        $('#sub_' + subID).find('h3').text(linkTitle);
        $('#sub_' + subID).fadeIn();
        $('#sub_' + subID).addClass('active');
        //return false;
    });

    // We need to remove any empty categories that may have been added
    $.each($('#subNav .subCatLabel'), function (i, element) {
        var nextElementClass = $(element).next().attr('class');
        if (nextElementClass == "subCatLabel" || nextElementClass == undefined) {
            //$('.catContent').find('#' + $(element).attr('id')).remove();
            //$(element).remove();
        }
    });

    $('#subNav h3').click(function () {
        $('.itemList,.active').fadeOut();
        $('.itemList').removeClass('active');
        $('#sub_0').fadeIn();
        $('#sub_0').addClass('active');
    });
});