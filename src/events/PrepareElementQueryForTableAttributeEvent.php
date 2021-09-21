<?php
/**
 * @link https://craftcms.com/
 * @copyright Copyright (c) Pixel & Tonic, Inc.
 * @license https://craftcms.github.io/license/
 */

namespace craft\events;

use craft\elements\db\ElementQueryInterface;
use yii\base\Event;

/**
 * Table attribute Element Query preparation event
 * 
 * Triggered while preparing an Element query for an Element index, for each attribute present in the table.
 *
 * @author Pixel & Tonic, Inc. <support@pixelandtonic.com>
 * @since 3.7.13
 */
class PrepareElementQueryForTableAttributeEvent extends Event
{
    /**
     * @var ElementQueryInterface The Element query being built
     */
    public $query;

    /**
     * @var string The table attribute name, as registered by the Element, and not implicitly a native field or attribute name.
     */
    public $attribute;
}
