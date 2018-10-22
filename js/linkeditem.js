(function($) {
  $.fn.extend({
    // Update all linked elements
    linkedUpdate: function() {
      //get value
      var value = $(this).val();
      //get list data
      var list = $(this).data('linked_list');
      if (!list || !list.length) {
        return;
      }
      //iterate over list
      $(list).each(function() {
        //make all inputs disabled
        var item = $(this);
        $(".hiddenFields > div", item).each(function() {
          $(this).hide().find(":input").attr('disabled', true);
        });

        // enable - 'edit-'+ value +'wrapper'
        if (!value.length) {
          return;
        }

        $(".hiddenFields > div.edit-" + value + "-wrapper", item).each(function() {
          $(this).show().find(":input").attr('disabled', false);
        });
      });
    }
  });

  Drupal.behaviors.linkeditem = {
    attach: function(context, settings) {
      $("div.linked-input:visible").each(function() {
        var hinput = $(this);
        var conf_key = hinput.attr("rel");
        if (!conf_key) {
          return;
        }
        if (!Drupal.settings.linkedinput) {
          return;
        }
        var settings = Drupal.settings.linkedinput[conf_key];
        if (!settings) {
          return;
        }

        //Get master element
        var id = 'edit';
        for (i in settings) {
          if (settings[i] == '$') {
            name = hinput.parent().attr('id')
            name_parts = name.match(/^.*-(\d+)-.*$/);
            if (!name_parts) {
              continue;
            }
            id += '-' + name_parts[1];
          } else {
            id += '-' + settings[i];
          }
        }
        //Bind slave to master
        var $master = $("#" + id); //FIXME how it would work with radio/checkboxes/hidden
        var list = $master.data('linked_list');
        if (!list) {
          list = [];
        }
        list[list.length] = hinput;
        $master.data('linked_list', list);
        //Trigger value change function
        $master.on('change', function() {
          var test = $(this);
          test.linkedUpdate();
        }).linkedUpdate();
      });
    }
  };
})(jQuery);