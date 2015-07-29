function wcThemeBuilder(myPanel) {
  this._panel = myPanel;
  this._controls = [];
  this._currentRow = 0;

  this.$part = $('<select style="width:100%">');

  this.init();
}

wcThemeBuilder.prototype = {
  addControls: function(controls) {
    for (var i = 0; i < controls.length; ++i) {
      controls[i].create(controls[i]);
      this._currentRow++;
    }

    this._panel.layout().addItem('<div>', 0, this._currentRow, 4).stretch('', '100%');
  },

  addSpacer: function(control) {
    this._panel.layout().addItem('<div class="wcAttributeSpacer">' + control.name + '</div>', 0, this._currentRow, 4).stretch('100%', '');
  },

  addColorControl: function(control) {
    var $activator = null;
    var $label = null;
    var $control = null;
    var self = this;
    
    $label = $('<label class="wcAttributeLabel" title="' + control.info + '">' + control.name + ':</label>');
    this._panel.layout().addItem($label, 1, this._currentRow).stretch('1%', '').css('text-align', 'right');

    $control = $('<input style="width:100%;" title="' + control.info + '"/>');
    this._panel.layout().addItem($control, 2, this._currentRow, 2).stretch('100%', '');
    $control.spectrum({
      color: control.value,
      showAlpha: true,
      showPalette: true,
      showInput: true,
      showInitial: true,
      palette: [
        ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
        ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
        ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
        ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
        ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
        ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
        ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
        ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
      ],
      selectionPalette: [],
      maxSelectionSize: 8,
      localStorageKey: "theme.colors",
      clickoutFiresChange: false,
      preferredFormat: 'rgb',
      change: function(color) {
        control.value = color.toRgbString();
        self.build();
      }
    });

    if (control.isOptional) {
      $activator = $('<input type="checkbox" title="' + control.info + '"/>');
      this._panel.layout().addItem($activator, 0, this._currentRow).stretch('1%', '');

      $activator.attr('checked', control.isActive);
      $activator.change(function() {
        control.isActive = this.checked;
        $control.spectrum(this.checked? 'enable': 'disable');
        self.build();
      });

      if (!control.isActive) {
        $control.spectrum('disable');
      }
    }
  },

  addPixelControl: function(control) {
    var $activator = null;
    var $label = null;
    var $control = null;
    var self = this;
    
    $label = $('<label class="wcAttributeLabel" title="' + control.info + '">' + control.name + ':</label>');
    this._panel.layout().addItem($label, 1, this._currentRow).stretch('1%', '').css('text-align', 'right');

    $control = $('<input style="width:100%;" title="' + control.info + '" type="number" step="1" min="1"/>');
    this._panel.layout().addItem($control, 2, this._currentRow, 2).stretch('100%', '');
    $control.val(parseInt(control.value));
    $control.change(function() {
      control.value = $(this).val() + 'px';
    });

    if (control.isOptional) {
      $activator = $('<input type="checkbox" title="' + control.info + '"/>');
      this._panel.layout().addItem($activator, 0, this._currentRow).stretch('1%', '');

      $activator.attr('checked', control.isActive);
      $activator.change(function() {
        control.isActive = this.checked;
        $control.attr('disabled', !this.checked);
        self.build();
      });

      if (!control.isActive) {
        $control.attr('disabled', true);
      }
    }
  },

  build: function() {
    // TODO:
  },

  init: function() {
    this._panel.layout().$table.css('padding', '10px');

    this.initParts();

    this._panel.layout().startBatch();
    this.addControls(this._controls);
    this._panel.layout().finishBatch();
  },

  initParts: function() {
    this._controls.push({
      name: 'Main',
      create: this.addSpacer.bind(this)
    });

    this._controls.push({
      selector: '.wcDocker, .wcPanelBackground',
      name: 'Background Color',
      info: 'The background color to use.',
      create: this.addColorControl.bind(this),
      attribute: 'background-color',
      value: 'gray'
    });

    this._controls.push({
      selector: '.wcModalBlocker',
      name: 'Modal Blocker Color',
      info: 'The color of the fullscreen blocker element that appears when a modal panel is visible.',
      create: this.addColorControl.bind(this),
      attribute: 'background-color',
      value: 'rgba(0, 0, 0, 0.8)'
    });



    this._controls.push({
      name: 'Panels',
      create: this.addSpacer.bind(this)
    });

    this._controls.push({
      selector: '.wcFrameFlasher',
      name: 'Panel Flash Color',
      info: 'The color of the panel when it focus flashes.',
      create: this.addColorControl.bind(this),
      attribute: 'background-color',
      value: 'rgba(255, 255, 255, 0.25)'
    });

    this._controls.push({
      selector: '.wcFrameShadower',
      name: 'Panel Shadow Color',
      info: 'The color of the panel when it is being moved by the user.',
      create: this.addColorControl.bind(this),
      attribute: 'background-color',
      value: 'rgba(255, 255, 255, 0.25)'
    });



    this._controls.push({
      name: 'Tabs',
      create: this.addSpacer.bind(this)
    });

    this._controls.push({
      selector: '.wcFrameTitleBar',
      name: 'Background Color',
      info: 'The color of the tab bar (behind the tabs).',
      create: this.addColorControl.bind(this),
      attribute: 'background-color',
      value: '#555'
    });

    this._controls.push({
      selector: '.wcFrameTitleBar',
      name: 'Height',
      info: 'The height of the title bar.',
      create: this.addPixelControl.bind(this),
      attribute: 'height',
      value: '17px'
    });
  }
}