(function ($) {
  /** global: Craft */
  /** global: Garnish */
  /**
   * Slide Picker
   */
  Craft.Slideout = Garnish.Base.extend(
    {
      $outerContainer: null,
      $container: null,
      $shade: null,
      isOpen: false,
      useMobileStyles: null,

      init: function (contents, settings) {
        this.setSettings(settings, Craft.Slideout.defaults);

        this.$outerContainer = $('<div/>', {
          class: 'slideout-container hidden',
        });
        this.$container = $(
          `<${this.settings.containerElement}/>`,
          this.settings.containerAttributes
        )
          .attr('data-slideout', '')
          .addClass('slideout')
          .append(contents)
          .data('slideout', this)
          .appendTo(this.$outerContainer);

        Garnish.addModalAttributes(this.$outerContainer);

        Craft.trapFocusWithin(this.$container);

        if (this.settings.autoOpen) {
          this.open();
        }
      },

      open: function () {
        if (this.isOpen) {
          return;
        }

        this.setTriggerElement(document.activeElement);

        this._cancelTransitionListeners();

        const activePreview =
          Craft.Preview.getActive() || Craft.LivePreview.getActive();
        this.useMobileStyles = activePreview || Craft.useMobileStyles();

        this.$outerContainer.removeClass('so-mobile so-lp');
        this.$container.removeClass('so-mobile so-lp');

        if (activePreview) {
          this.$outerContainer.addClass('so-lp');
          this.$container.addClass('so-lp');
        } else if (this.useMobileStyles) {
          this.$container.addClass('so-mobile');
        }

        if (activePreview || !this.useMobileStyles) {
          if (!this.$shade) {
            this.$shade = $('<div class="slideout-shade"/>');

            if (this.settings.closeOnShadeClick) {
              this.addListener(this.$shade, 'click', (ev) => {
                ev.stopPropagation();
                this.close();
              });
            }
          }

          // Keep the shade + container to the end of <body> so they get the highest sub-z-indexes
          if (activePreview) {
            this.$shade.appendTo(activePreview.$editorContainer);
          } else {
            this.$shade.appendTo(Garnish.$bod);
          }

          this.$shade.show();
        }

        if (activePreview) {
          this.$outerContainer.appendTo(activePreview.$editorContainer);
        } else {
          this.$outerContainer.appendTo(Garnish.$bod);
        }

        this.$outerContainer.removeClass('hidden');

        if (this.useMobileStyles) {
          this.$container
            .css('top', '100vh')
            .css(Garnish.ltr ? 'left' : 'right', '');
        } else {
          this.$container
            .css('top', '')
            .css(Garnish.ltr ? 'left' : 'right', '100vw');
        }

        this.$container.one('transitionend.slideout', () => {
          Craft.setFocusWithin(this.$container);
        });

        if (this.$shade) {
          this.$shade[0].offsetWidth;
          this.$shade.addClass('so-visible');
        }

        this.$container[0].offsetWidth;
        Craft.Slideout.addPanel(this);

        this.enable();
        Garnish.uiLayerManager.addLayer(this.$outerContainer);
        Garnish.hideModalBackgroundLayers();

        if (this.settings.closeOnEsc) {
          Garnish.uiLayerManager.registerShortcut(Garnish.ESC_KEY, () => {
            this.close();
          });
        }

        this.isOpen = true;
        this.trigger('open');
      },

      setTriggerElement: function (trigger) {
        this.settings.triggerElement = trigger;
      },

      close: function () {
        if (!this.isOpen) {
          return;
        }

        this.trigger('beforeClose');
        this.disable();
        this.isOpen = false;

        this._cancelTransitionListeners();

        if (this.$shade) {
          this.$shade
            .removeClass('so-visible')
            .one('transitionend.slideout', () => {
              this.$shade.hide();
            });
        }

        Craft.Slideout.removePanel(this);
        Garnish.uiLayerManager.removeLayer();
        Garnish.resetModalBackgroundLayerVisibility();
        this.$container.one('transitionend.slideout', () => {
          this.$outerContainer.addClass('hidden');
          this.trigger('close');
        });

        if (this.settings.triggerElement) {
          this.settings.triggerElement.focus();
        }
      },

      _cancelTransitionListeners: function () {
        if (this.$shade) {
          this.$shade.off('transitionend.slideout');
        }

        this.$container.off('transitionend.slideout');
      },

      /**
       * Destroy
       */
      destroy: function () {
        if (this.$shade) {
          this.$shade.remove();
          this.$shade = null;
        }

        this.$outerContainer.remove();
        this.$outerContainer = null;
        this.$container = null;

        this.base();
      },
    },
    {
      defaults: {
        containerElement: 'div',
        containerAttributes: {},
        autoOpen: true,
        closeOnEsc: true,
        closeOnShadeClick: true,
        triggerElement: null,
      },
      openPanels: [],
      addPanel: function (panel) {
        Craft.Slideout.openPanels.unshift(panel);
        if (panel.useMobileStyles) {
          panel.$container.css('top', 0);
        } else {
          Craft.Slideout.updateStyles();
        }
      },
      removePanel: function (panel) {
        Craft.Slideout.openPanels = Craft.Slideout.openPanels.filter(
          (m) => m !== panel
        );
        if (panel.useMobileStyles) {
          panel.$container.css('top', '100vh');
        } else {
          panel.$container.css(Garnish.ltr ? 'left' : 'right', '100vw');
          Craft.Slideout.updateStyles();
        }
      },
      updateStyles: function () {
        const totalPanels = Craft.Slideout.openPanels.length;
        Craft.Slideout.openPanels.forEach((panel, i) => {
          panel.$container.css(
            Garnish.ltr ? 'left' : 'right',
            `${50 * ((totalPanels - i) / totalPanels)}vw`
          );
        });

        if (totalPanels !== 0) {
          Garnish.$bod.addClass('no-scroll');
        } else {
          Garnish.$bod.removeClass('no-scroll');
        }
      },
    }
  );
})(jQuery);
