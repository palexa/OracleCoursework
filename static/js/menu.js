
$('div.menu-item').hover(function () {
    this.id='menu-item_border';
},function () {
    this.id='';
});
$('div.down').click(function () {
    $(this).hide(1000);
});